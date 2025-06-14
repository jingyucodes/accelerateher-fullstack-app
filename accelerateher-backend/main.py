from fastapi import FastAPI, HTTPException, Path, Body, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from typing import Optional, Dict, List
import logging
import os
from dotenv import load_dotenv
from models import UserProfileSchema, UserProfileInDB, User, UserCreate, UserLogin, UserResponse, ForumPost, LearningPath, LearningModule
from database import user_profiles_collection, get_db_client, close_db_client, add_user_profile, get_user_profile, update_user_profile, add_forum_post, get_forum_posts, get_user_by_user_id, create_user, get_user_by_id as get_user_by_mongodb_id, update_user_analytics
from google import genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__) # Use 'main' or __name__ for the logger

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")  # In production, use a proper secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="AccelerateHer User Profile API")

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:5173",  # Local development
    "http://localhost:3000",  # Local development alternative port
    "https://your-frontend-domain.com",  # Your deployed frontend URL
    "*"  # Allow all origins (only for development, remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    client_instance, uri_used_for_init = await get_db_client()
    app.mongodb_client = client_instance

    print(f"--- DEBUG (main.py startup - BEFORE PING) ---")
    print(f"URI used for client init: {uri_used_for_init}")
    if app.mongodb_client:
        print(f"Initial app.mongodb_client.HOST: {app.mongodb_client.HOST}")
        print(f"Initial app.mongodb_client.PORT: {app.mongodb_client.PORT}")
        print(f"Initial app.mongodb_client.nodes: {app.mongodb_client.nodes}")
    else:
        print("app.mongodb_client is None before ping!")
    print(f"--- END DEBUG (main.py startup - BEFORE PING) ---")

    log_host_attempt = app.mongodb_client.HOST if app.mongodb_client else "unknown_host"
    log_port_attempt = app.mongodb_client.PORT if app.mongodb_client else "unknown_port"
    
    logger.info(f"Client initialized with URI: {uri_used_for_init}") # This log comes from database.py
    logger.info(f"Attempting first MongoDB operation (ping) via client initially reporting: {log_host_attempt}:{log_port_attempt}")

    try:
        if app.mongodb_client:
            await app.mongodb_client.admin.command('ping')
            logger.info(f"MongoDB ping successful!") # This log means it connected to SOME MongoDB
            
            print(f"--- DEBUG (main.py startup - AFTER SUCCESSFUL PING) ---")
            print(f"app.mongodb_client.HOST after ping: {app.mongodb_client.HOST}")
            print(f"app.mongodb_client.PORT after ping: {app.mongodb_client.PORT}")
            print(f"app.mongodb_client.nodes after ping: {app.mongodb_client.nodes}") # THIS IS KEY!
            if app.mongodb_client.nodes:
                actual_connected_node = list(app.mongodb_client.nodes)[0]
                logger.info(f"Client is now connected to a cluster. Example node: {actual_connected_node[0]}:{actual_connected_node[1]}")
            else:
                logger.warning("app.mongodb_client.nodes is empty after successful ping - this is unusual for SRV.")
            print(f"--- END DEBUG (main.py startup - AFTER SUCCESSFUL PING) ---")
        else:
            logger.error("MongoDB client (app.mongodb_client) is not available for ping.")
    except Exception as e:
        logger.error(f"MongoDB ping failed (initial client report {log_host_attempt}:{log_port_attempt}): {e}", exc_info=True)

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db_client()
    logger.info("MongoDB connection closed.")

# Authentication helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_from_token: str = payload.get("sub")
        if user_id_from_token is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_user_id(user_id_from_token)
    if user is None:
        raise credentials_exception
    return user

def determine_learning_path(profile_data: UserProfileSchema) -> dict:
    goals = profile_data.futureSkills.lower() if profile_data.futureSkills else ""
    path_data = None
    rec_skills = []
    
    # Define learning paths
    paths = {
        "cloud": {
            "title": "Cloud Computing Course",
            "modules": [
                {"id": 'cloud_intro', "text": 'Module 1: Intro to Cloud Concepts'},
                {"id": 'aws_basics', "text": 'Module 2: AWS Core Services'},
                {"id": 'azure_basics', "text": 'Module 3: Azure Fundamentals'},
            ],
            "skills": ["DevOps Principles", "Cloud Security Best Practices"]
        },
        "python": {
            "title": "Python Programming Course",
            "modules": [
                {"id": 'python_fundamentals', "text": 'Module 1: Python Basics'},
                {"id": 'python_data_structures', "text": 'Module 2: Data Structures in Python'},
                {"id": 'python_oop', "text": 'Module 3: Object-Oriented Python'},
            ],
            "skills": ["NumPy & Pandas", "Data Visualization", "Web Scraping with Python"]
        },
        "web": {
            "title": "Web Development Course",
            "modules": [
                {"id": 'html_css_js', "text": 'Module 1: HTML, CSS, JavaScript'},
                {"id": 'react_basics', "text": 'Module 2: React Fundamentals'},
                {"id": 'nodejs_express', "text": 'Module 3: Backend with Node.js'},
            ],
            "skills": ["Responsive Design", "API Design"]
        }
    }

    if "cloud" in goals or "azure" in goals or "aws" in goals:
        chosen_path = paths["cloud"]
        rec_skills = chosen_path["skills"]
    elif "python" in goals:
        chosen_path = paths["python"]
        if "data" in goals:
            rec_skills = [s for s in chosen_path["skills"] if s in ["NumPy & Pandas", "Data Visualization"]]
        else:
            rec_skills = [s for s in chosen_path["skills"] if s == "Web Scraping with Python"]
    elif "web" in goals or "full-stack" in goals:
        chosen_path = paths["web"]
        rec_skills = chosen_path["skills"]
    else:
        return {"activeLearningPath": None, "recommendedSkills": ["Git & Version Control", "Agile Methodologies"]}

    # Create LearningModule instances
    learning_modules = [LearningModule(
        id=m['id'], text=m['text'], 
        locked=(i > 0), # First module unlocked
        inProgress=(i == 0), # First module in progress
        completed=False
    ) for i, m in enumerate(chosen_path["modules"])]
    
    # Create LearningPath instance
    path_data = LearningPath(
        title=chosen_path["title"],
        progress='0% complete', # Or calculate based on completed modules
        modules=learning_modules
    )

    return {"activeLearningPath": path_data, "recommendedSkills": rec_skills}

# Authentication endpoints
@app.post("/api/auth/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    existing_user = await get_user_by_user_id(user_data.user_id)
    if existing_user:
        raise HTTPException(status_code=400, detail="User ID already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user_doc = {
        "user_id": user_data.user_id,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    created_user_doc = await create_user(user_doc)
    if not created_user_doc:
        raise HTTPException(status_code=500, detail="Failed to create user")

    mongodb_doc_id_str = str(created_user_doc["_id"])
    
    profile_doc_id = created_user_doc["user_id"]
    
    default_profile_data = {
        "_id": mongodb_doc_id_str,
        "user_id": created_user_doc["user_id"],
        "userName": created_user_doc["user_id"],
        "bio": "",
        "interests": [],
        "goals": [],
        "completed_modules": [],
        "points": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    try:
        await add_user_profile(default_profile_data)
        logger.info(f"Default profile created for user with MongoDB ID: {mongodb_doc_id_str}")
    except Exception as e:
        logger.error(f"Failed to create default profile for user MongoDB ID {mongodb_doc_id_str}: {e}")

    return UserResponse(
        id=mongodb_doc_id_str,
        user_id=created_user_doc["user_id"],
        created_at=created_user_doc["created_at"]
    )

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_user_id(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect User ID or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["user_id"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "user_id": user["user_id"]
        }
    }

# Protected routes
@app.get("/api/profile/{profile_owner_mongodb_id}")
async def get_profile(profile_owner_mongodb_id: str, current_user_from_token: User = Depends(get_current_user)):
    profile = await get_user_profile(profile_owner_mongodb_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profile/{profile_owner_mongodb_id}")
async def update_profile(
    profile_owner_mongodb_id: str,
    profile_data: UserProfileSchema = Body(...),
    current_user_from_token: User = Depends(get_current_user)
):
    if str(current_user_from_token["_id"]) != profile_owner_mongodb_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    # Determine learning path based on goals
    path_info = determine_learning_path(profile_data)

    data_to_update = profile_data.model_dump(exclude_unset=True)
    data_to_update["updated_at"] = datetime.utcnow()
    
    # Convert Pydantic models to dictionaries for MongoDB storage
    if "activeLearningPath" in path_info and path_info["activeLearningPath"] is not None:
        data_to_update["activeLearningPath"] = path_info["activeLearningPath"].model_dump()
    else:
        data_to_update["activeLearningPath"] = None
    
    data_to_update["recommendedSkills"] = path_info.get("recommendedSkills", [])
    
    # First try to update existing profile
    updated_profile_doc = await update_user_profile(profile_owner_mongodb_id, data_to_update)
    
    if updated_profile_doc is None:
        # Profile doesn't exist, create a new one
        logger.info(f"Profile not found for user {profile_owner_mongodb_id}, creating new profile")
        
        # Create new profile with the user's MongoDB ID as the _id
        new_profile_data = {
            "_id": profile_owner_mongodb_id,
            "user_id": current_user_from_token["user_id"],
            "userName": data_to_update.get("userName", current_user_from_token["user_id"]),
            "created_at": datetime.utcnow(),
            **data_to_update
        }
        
        try:
            created_profile = await add_user_profile(new_profile_data)
            if created_profile is None:
                raise HTTPException(status_code=500, detail="Failed to create profile")
            return created_profile
        except Exception as e:
            logger.error(f"Error creating profile for user {profile_owner_mongodb_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create profile: {str(e)}")
    
    return updated_profile_doc

# Forum routes (protected)
@app.get("/api/forum/posts")
async def get_posts(current_user: User = Depends(get_current_user)):
    return await get_forum_posts()

@app.post("/api/forum/posts")
async def create_post(
    post_data: ForumPost,
    current_user: User = Depends(get_current_user)
):
    post_data.user_id = current_user["user_id"]
    return await add_forum_post(post_data.model_dump(by_alias=True))

@app.get("/")
async def read_root():
    return {"message": "Welcome to AccelerateHer User Profile API!"}

@app.post("/api/analytics/track-module-progress")
async def track_module_progress(
    module_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Track user's progress in a specific module"""
    try:
        user_profile = await get_user_profile(str(current_user["_id"]))
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        module_id = module_data.get("module_id")
        time_spent = module_data.get("time_spent_minutes", 0)
        is_completed = module_data.get("completed", False)
        quiz_score = module_data.get("quiz_score")

        # Initialize analytics if not exists
        analytics = user_profile.get("analytics") or {
            "user_id": str(current_user["_id"]),
            "current_week": {
                "week_start": datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0),
                "week_end": (datetime.utcnow() + timedelta(days=7)).replace(hour=23, minute=59, second=59),
                "planned_hours": int(user_profile.get("timeCommitment", "0").split()[0]),
                "completed_hours": 0,
                "completed_modules": [],
                "active_days": 0
            },
            "current_month": {
                "month_start": datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0),
                "month_end": (datetime.utcnow().replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1),
                "total_hours": 0,
                "completed_modules": [],
                "learning_velocity": 0.0,
                "streak_days": 0
            },
            "module_progress": {},
            "total_completion_percentage": 0.0,
            "last_updated": datetime.utcnow()
        }

        # Update module progress
        if module_id not in analytics["module_progress"]:
            analytics["module_progress"][module_id] = {
                "module_id": module_id,
                "started_at": datetime.utcnow(),
                "time_spent_minutes": 0,
                "attempts": 0
            }

        module_progress = analytics["module_progress"][module_id]
        module_progress["time_spent_minutes"] += time_spent
        module_progress["last_accessed"] = datetime.utcnow()
        
        if is_completed:
            module_progress["completed_at"] = datetime.utcnow()
            completed_modules = user_profile.get("completed_modules", [])
            
            if module_id not in completed_modules:
                # Add module to completed list
                completed_modules.append(module_id)
                logger.info(f"Adding module {module_id} to completed list for user {str(current_user['_id'])}")
                
                # IMPORTANT: Update the main profile with completed modules immediately
                await update_user_profile(str(current_user["_id"]), {"completed_modules": completed_modules})
                logger.info(f"Updated main profile with completed modules: {completed_modules}")
            else:
                # Module already completed, don't track additional progress
                logger.info(f"Module {module_id} already completed for user {str(current_user['_id'])}")
                return {"status": "success", "message": "Module already completed"}
                
                # Update learning path modules with completion status
                if user_profile.get("activeLearningPath") and user_profile["activeLearningPath"].get("modules"):
                    modules = user_profile["activeLearningPath"]["modules"]
                    updated_modules = []
                    
                    for i, module in enumerate(modules):
                        # Create a copy of the module to avoid modifying the original
                        updated_module = dict(module)
                        
                        # Check if this module is completed based on completed_modules list
                        is_module_completed = updated_module["id"] in completed_modules
                        updated_module["completed"] = is_module_completed
                        
                        # Set inProgress status
                        if is_module_completed:
                            updated_module["inProgress"] = False
                        else:
                            # Module is in progress if it's the first incomplete module
                            prev_modules_completed = all(
                                mod["id"] in completed_modules 
                                for mod in modules[:i]
                            ) if i > 0 else True
                            updated_module["inProgress"] = prev_modules_completed
                        
                        # Set locked status
                        if i == 0:
                            # First module is always unlocked
                            updated_module["locked"] = False
                        else:
                            # Module is locked if the previous module is not completed
                            prev_module_completed = modules[i-1]["id"] in completed_modules
                            updated_module["locked"] = not prev_module_completed
                            
                        updated_modules.append(updated_module)
                    
                    # Calculate progress percentage based on completed_modules
                    total_modules = len(updated_modules)
                    completed_count = len(completed_modules)
                    progress_percentage = (completed_count / total_modules) * 100 if total_modules > 0 else 0
                    
                    # Update the learning path
                    updated_learning_path = {
                        **user_profile["activeLearningPath"],
                        "modules": updated_modules,
                        "progress": f"{int(progress_percentage)}% complete"
                    }
                    
                    # Update only the learning path since completed_modules was already updated above
                    await update_user_profile(str(current_user["_id"]), {
                        "activeLearningPath": updated_learning_path
                    })
                    logger.info(f"Updated learning path with progress: {progress_percentage}%")
                
                # Update in memory for analytics calculation
                user_profile["completed_modules"] = completed_modules

        if quiz_score is not None:
            module_progress["quiz_score"] = quiz_score

        # Update weekly progress
        weekly_hours = time_spent / 60  # Convert minutes to hours
        analytics["current_week"]["completed_hours"] += weekly_hours
        analytics["current_month"]["total_hours"] += weekly_hours

        # Recalculate analytics based on current learning path modules
        learning_path_modules = user_profile.get("activeLearningPath", {}).get("modules", [])
        path_module_ids = [mod["id"] for mod in learning_path_modules]
        completed_modules_list = user_profile.get("completed_modules", [])
        
        # Filter completed modules to only include those in current learning path
        completed_in_current_path = [mod for mod in completed_modules_list if mod in path_module_ids]
        
        # Update weekly and monthly analytics with all completed modules from current path
        analytics["current_week"]["completed_modules"] = completed_in_current_path.copy()
        analytics["current_month"]["completed_modules"] = completed_in_current_path.copy()

        # Calculate completion percentage based on current learning path
        if learning_path_modules:
            total_modules = len(learning_path_modules)
            analytics["total_completion_percentage"] = (len(completed_in_current_path) / total_modules) * 100
        else:
            analytics["total_completion_percentage"] = 0

        # Update learning velocity (modules per week) - assuming 1 week active period for now
        analytics["current_month"]["learning_velocity"] = len(completed_in_current_path) / 1 if len(completed_in_current_path) > 0 else 0

        # Reset streak to a reasonable value based on account creation date
        # For now, reset to 1 if user has completed modules, 0 if not
        if len(completed_in_current_path) > 0:
            analytics["current_month"]["streak_days"] = 1  # Reset to 1 day since they're active
            analytics["current_month"]["last_activity_date"] = datetime.utcnow().date().isoformat()
        else:
            analytics["current_month"]["streak_days"] = 0
            analytics["current_month"]["last_activity_date"] = None

        analytics["last_updated"] = datetime.utcnow()

        # Debug: Log analytics before saving
        logger.info(f"ANALYTICS BEFORE SAVE:")
        logger.info(f"  - Current week completed modules: {analytics['current_week']['completed_modules']}")
        logger.info(f"  - Current month completed modules: {analytics['current_month']['completed_modules']}")
        logger.info(f"  - Total completion percentage: {analytics['total_completion_percentage']}")
        logger.info(f"  - Learning velocity: {analytics['current_month']['learning_velocity']}")

        # Save only analytics field
        await update_user_analytics(str(current_user["_id"]), analytics)

        # CRITICAL: Fetch updated profile to return to frontend
        updated_profile = await get_user_profile(str(current_user["_id"]))
        logger.info(f"Returning updated profile with completed_modules: {updated_profile.get('completed_modules', [])}")
        
        # Debug: Log saved analytics
        saved_analytics = updated_profile.get("analytics", {})
        logger.info(f"SAVED ANALYTICS:")
        logger.info(f"  - Current week completed modules: {saved_analytics.get('current_week', {}).get('completed_modules', [])}")
        logger.info(f"  - Current month completed modules: {saved_analytics.get('current_month', {}).get('completed_modules', [])}")
        logger.info(f"  - Total completion percentage: {saved_analytics.get('total_completion_percentage', 0)}")

        return {
            "status": "success", 
            "message": "Progress updated successfully",
            "completed_modules": updated_profile.get("completed_modules", []),
            "learning_path": updated_profile.get("activeLearningPath")
        }

    except Exception as e:
        logger.error(f"Error tracking module progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/user-progress/{user_id}")
async def get_user_progress(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed analytics for a user"""
    try:
        user_profile = await get_user_profile(user_id)
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        if not user_profile.get("analytics"):
            return {
                "completion_percentage": 0,
                "weekly_progress": {
                    "planned_hours": 0,
                    "completed_hours": 0,
                    "completed_modules": []
                },
                "monthly_progress": {
                    "total_hours": 0,
                    "completed_modules": [],
                    "learning_velocity": 0,
                    "streak_days": 0
                }
            }

        analytics = user_profile["analytics"]
        return {
            "completion_percentage": analytics["total_completion_percentage"],
            "weekly_progress": {
                "planned_hours": analytics["current_week"]["planned_hours"],
                "completed_hours": analytics["current_week"]["completed_hours"],
                "completed_modules": analytics["current_week"]["completed_modules"]
            },
            "monthly_progress": {
                "total_hours": analytics["current_month"]["total_hours"],
                "completed_modules": analytics["current_month"]["completed_modules"],
                "learning_velocity": analytics["current_month"]["learning_velocity"],
                "streak_days": analytics["current_month"]["streak_days"]
            }
        }

    except Exception as e:
        logger.error(f"Error getting user progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug/profile/{user_id}")
async def debug_user_profile(user_id: str, current_user: User = Depends(get_current_user)):
    """Debug endpoint to check user profile state in database"""
    try:
        profile = await get_user_profile(user_id)
        if not profile:
            return {"error": "Profile not found"}
        
        return {
            "profile_id": str(profile.get("_id")),
            "completed_modules": profile.get("completed_modules", []),
            "learning_path_title": profile.get("activeLearningPath", {}).get("title"),
            "learning_path_progress": profile.get("activeLearningPath", {}).get("progress"),
            "learning_path_modules": profile.get("activeLearningPath", {}).get("modules", []),
            "analytics_exists": bool(profile.get("analytics")),
            "analytics_completion": profile.get("analytics", {}).get("total_completion_percentage", 0),
            "analytics_week_modules": profile.get("analytics", {}).get("current_week", {}).get("completed_modules", []),
            "analytics_month_modules": profile.get("analytics", {}).get("current_month", {}).get("completed_modules", []),
            "analytics_velocity": profile.get("analytics", {}).get("current_month", {}).get("learning_velocity", 0)
        }
    except Exception as e:
        logger.error(f"Debug endpoint error: {e}")
        return {"error": str(e)}

@app.post("/api/analytics/refresh")
async def refresh_analytics(current_user: User = Depends(get_current_user)):
    """Refresh analytics data based on current completed modules"""
    try:
        user_profile = await get_user_profile(str(current_user["_id"]))
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        # Get current completed modules and learning path
        completed_modules = user_profile.get("completed_modules", [])
        learning_path_modules = user_profile.get("activeLearningPath", {}).get("modules", [])
        path_module_ids = [mod["id"] for mod in learning_path_modules]
        
        # Filter completed modules to only include those in current learning path
        completed_in_current_path = [mod for mod in completed_modules if mod in path_module_ids]

        # Initialize or get existing analytics
        analytics = user_profile.get("analytics") or {
            "user_id": str(current_user["_id"]),
            "current_week": {
                "week_start": datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0),
                "week_end": (datetime.utcnow() + timedelta(days=7)).replace(hour=23, minute=59, second=59),
                "planned_hours": int(user_profile.get("timeCommitment", "0").split()[0]) if user_profile.get("timeCommitment") else 0,
                "completed_hours": 0,
                "completed_modules": [],
                "active_days": 0
            },
            "current_month": {
                "month_start": datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0),
                "month_end": (datetime.utcnow().replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1),
                "total_hours": 0,
                "completed_modules": [],
                "learning_velocity": 0.0,
                "streak_days": 0
            },
            "module_progress": {},
            "total_completion_percentage": 0.0,
            "last_updated": datetime.utcnow()
        }

        # Update analytics with current data
        analytics["current_week"]["completed_modules"] = completed_in_current_path.copy()
        analytics["current_month"]["completed_modules"] = completed_in_current_path.copy()

        # Calculate completion percentage
        if learning_path_modules:
            total_modules = len(learning_path_modules)
            analytics["total_completion_percentage"] = (len(completed_in_current_path) / total_modules) * 100
        else:
            analytics["total_completion_percentage"] = 0

        # Update learning velocity
        analytics["current_month"]["learning_velocity"] = len(completed_in_current_path) / 1 if len(completed_in_current_path) > 0 else 0

        # Reset streak to a reasonable value based on account creation date
        # For now, reset to 1 if user has completed modules, 0 if not
        if len(completed_in_current_path) > 0:
            analytics["current_month"]["streak_days"] = 1  # Reset to 1 day since they're active
            analytics["current_month"]["last_activity_date"] = datetime.utcnow().date().isoformat()
        else:
            analytics["current_month"]["streak_days"] = 0
            analytics["current_month"]["last_activity_date"] = None

        analytics["last_updated"] = datetime.utcnow()

        # Save analytics
        await update_user_analytics(str(current_user["_id"]), analytics)

        return {
            "status": "success",
            "message": "Analytics refreshed successfully",
            "completed_modules": completed_in_current_path,
            "total_completion": analytics["total_completion_percentage"],
            "weekly_modules": len(completed_in_current_path),
            "monthly_velocity": analytics["current_month"]["learning_velocity"]
        }

    except Exception as e:
        logger.error(f"Error refreshing analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/reset-streak")
async def reset_streak(current_user: User = Depends(get_current_user)):
    """Reset streak to a reasonable value - debug endpoint"""
    try:
        user_profile = await get_user_profile(str(current_user["_id"]))
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        analytics = user_profile.get("analytics")
        if not analytics:
            return {"status": "error", "message": "No analytics found"}

        # Reset streak to 1 if user has completed modules, 0 if not
        completed_modules = user_profile.get("completed_modules", [])
        if len(completed_modules) > 0:
            analytics["current_month"]["streak_days"] = 1
            analytics["current_month"]["last_activity_date"] = datetime.utcnow().date().isoformat()
        else:
            analytics["current_month"]["streak_days"] = 0
            analytics["current_month"]["last_activity_date"] = None

        analytics["last_updated"] = datetime.utcnow()

        # Save analytics
        await update_user_analytics(str(current_user["_id"]), analytics)

        return {
            "status": "success",
            "message": "Streak reset successfully",
            "new_streak": analytics["current_month"]["streak_days"]
        }

    except Exception as e:
        logger.error(f"Error resetting streak: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# To run the server: uvicorn main:app --reload