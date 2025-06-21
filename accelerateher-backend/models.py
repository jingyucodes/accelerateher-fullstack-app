from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Any, ClassVar, List, Dict
from datetime import datetime, timedelta
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: dict[str, Any]) -> None:
        field_schema.update(type="string")

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class UserCreate(BaseModel):
    user_id: str
    password: str

    model_config = ConfigDict(
        populate_by_name=True
    )

class UserLogin(BaseModel):
    username: str
    password: str

    model_config = ConfigDict(
        populate_by_name=True
    )

class UserResponse(BaseModel):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True
    )

class LearningModule(BaseModel):
    id: str
    text: str
    locked: bool = True
    inProgress: bool = False
    completed: bool = False

class LearningPath(BaseModel):
    title: str
    progress: str = "0% complete"
    modules: List[LearningModule] = []

class ModuleProgress(BaseModel):
    module_id: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    time_spent_minutes: int = 0
    attempts: int = 0
    quiz_score: Optional[float] = None
    last_accessed: Optional[datetime] = None

class WeeklyProgress(BaseModel):
    week_start: datetime
    week_end: datetime
    planned_hours: int
    completed_hours: int
    completed_modules: List[str] = []
    active_days: int = 0

class MonthlyProgress(BaseModel):
    month_start: datetime
    month_end: datetime
    total_hours: int
    completed_modules: List[str] = []
    learning_velocity: float = 0.0  # modules completed per week
    streak_days: int = 0
    last_activity_date: Optional[str] = None  # Track last activity date for streak calculation

class LearningAnalytics(BaseModel):
    user_id: str
    current_week: WeeklyProgress
    current_month: MonthlyProgress
    module_progress: Dict[str, ModuleProgress] = {}  # module_id -> progress
    total_completion_percentage: float = 0.0
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class UserProfile(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    userName: str
    completed_modules: list[str] = []
    points: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    activeLearningPath: Optional[LearningPath] = None
    recommendedSkills: List[str] = []
    analytics: Optional[LearningAnalytics] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class ForumTopic(BaseModel):
    id: str # e.g. "general"
    name: str # e.g. "# General Discussion"
    description: Optional[str] = None

class ForumReply(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    thread_id: PyObjectId
    author_user_id: str
    author_username: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class ForumReplyCreate(BaseModel):
    content: str

class ForumThread(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    topic_id: str
    title: str
    content: str
    author_user_id: str
    author_username: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity_at: datetime = Field(default_factory=datetime.utcnow)
    replies: Optional[List[ForumReply]] = []
    reply_count: int = 0

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class ForumThreadCreate(BaseModel):
    topic_id: str
    title: str
    content: str

class UserProfileSchema(BaseModel):
    userName: Optional[str] = None
    futureSkills: Optional[str] = ""
    currentSkills: Optional[str] = ""
    preferredLearningStyle: Optional[str] = ""
    timeCommitment: Optional[str] = ""
    learningPreferences: Optional[str] = ""
    endGoalMotivation: Optional[str] = ""
    notificationsPreference: Optional[str] = ""
    activeLearningPath: Optional[LearningPath] = None
    recommendedSkills: List[str] = []

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "userName": "Jane Doe",
                "futureSkills": "Cloud Engineering, DevOps",
                "currentSkills": "Python basics, some SQL",
                "preferredLearningStyle": "Hands-on projects, Video tutorials",
                "timeCommitment": "10 hours/week",
                "learningPreferences": "Coding exercises, Case studies",
                "endGoalMotivation": "Career change to a tech role",
                "notificationsPreference": "Yes",
                "activeLearningPath": {
                    "title": "Introduction to Cloud Computing",
                    "progress": "20% complete",
                    "modules": [
                        {"id": "module1", "text": "Introduction to Cloud Computing", "locked": False, "inProgress": True, "completed": False},
                        {"id": "module2", "text": "Understanding Cloud Platforms", "locked": False, "inProgress": False, "completed": False},
                        {"id": "module3", "text": "Deploying Applications on Cloud Platforms", "locked": False, "inProgress": False, "completed": False}
                    ]
                },
                "recommendedSkills": ["Python", "Cloud Platforms"]
            }
        }
    )

class UserProfileInDB(UserProfileSchema):
    user_id: str = Field(..., alias="_id")  # Use user_id as the document _id in MongoDB
    
    model_config = ConfigDict(
        populate_by_name=True
    )