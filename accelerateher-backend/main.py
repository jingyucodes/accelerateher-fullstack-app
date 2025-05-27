from fastapi import FastAPI, HTTPException, Path, Body, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from typing import Optional
import logging
import os
from dotenv import load_dotenv
from models import UserProfileSchema, UserProfileInDB, User, UserCreate, UserLogin, UserResponse, ForumPost
from database import user_profiles_collection, get_db_client, close_db_client, add_user_profile, get_user_profile, update_user_profile, add_forum_post, get_forum_posts, get_user_by_username, create_user, get_user_by_id

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
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_username(username)
    if user is None:
        raise credentials_exception
    return user

# Authentication endpoints
@app.post("/api/auth/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    # Check if username already exists
    existing_user = await get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_doc = {
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    created_user = await create_user(user_doc)
    if not created_user:
        raise HTTPException(status_code=500, detail="Failed to create user")

    # Create a default user profile
    user_id_str = str(created_user["_id"])
    default_profile_data = {
        "user_id": user_id_str,
        "name": created_user["username"],  # Or some default name
        "bio": "",
        "interests": [],
        "goals": [],
        "completed_modules": [],
        "points": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Attempt to add the profile to the user_profiles collection
    # The UserProfile model in models.py expects '_id' as the primary key
    # but we are linking via user_id. The upsert endpoint /api/profile/{user_id} uses _id for user_profiles.
    # For consistency and to avoid confusion, let's ensure the document _id for user_profiles collection is the user_id.
    
    # We'll use the existing add_user_profile function which expects a dict.
    # It internally handles inserting into user_profiles_collection.
    # The key for user_profiles in DB is `_id` which will store the `user_id_str`.
    
    profile_to_insert = default_profile_data.copy()
    profile_to_insert["_id"] = user_id_str # Set the document _id to be the user_id

    try:
        await add_user_profile(profile_to_insert)
        logger.info(f"Default profile created for user_id: {user_id_str}")
    except Exception as e:
        # Log the error, but don't fail the signup if profile creation fails.
        # The user can try to update their profile later.
        logger.error(f"Failed to create default profile for user_id {user_id_str}: {e}")

    return UserResponse(
        id=user_id_str,
        username=created_user["username"],
        email=created_user["email"],
        created_at=created_user["created_at"]
    )

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    }

# Protected routes
@app.get("/api/profile/{user_id}")
async def get_profile(user_id: str, current_user: User = Depends(get_current_user)):
    profile = await get_user_profile(user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profile/{user_id}")
async def update_profile(
    user_id: str,
    profile_data: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    if str(current_user["_id"]) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    updated_profile = await update_user_profile(user_id, profile_data)
    if updated_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated_profile

# Forum routes (protected)
@app.get("/api/forum/posts")
async def get_posts(current_user: User = Depends(get_current_user)):
    return await get_forum_posts()

@app.post("/api/forum/posts")
async def create_post(
    post_data: ForumPost,
    current_user: User = Depends(get_current_user)
):
    post_data.user_id = str(current_user["_id"])
    return await add_forum_post(post_data.model_dump(by_alias=True))

@app.get("/")
async def read_root():
    return {"message": "Welcome to AccelerateHer User Profile API!"}

# To run the server: uvicorn main:app --reload