from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, Any, ClassVar
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: dict[str, Any]) -> None:
        field_schema.update(type="string")

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class UserCreate(BaseModel):
    username: str
    email: EmailStr
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
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True
    )

class UserProfile(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    name: str
    bio: Optional[str] = None
    interests: list[str] = []
    goals: list[str] = []
    completed_modules: list[str] = []
    points: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class ForumPost(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    title: str
    content: str
    likes: int = 0
    comments: list[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class UserProfileSchema(BaseModel):
    name: Optional[str] = "Learner"
    futureSkills: Optional[str] = ""
    currentSkills: Optional[str] = ""
    preferredLearningStyle: Optional[str] = ""
    timeCommitment: Optional[str] = ""
    learningPreferences: Optional[str] = ""
    endGoalMotivation: Optional[str] = ""
    notificationsPreference: Optional[str] = ""

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "name": "Jane Doe",
                "futureSkills": "Cloud Engineering, DevOps",
                "currentSkills": "Python basics, some SQL",
                "preferredLearningStyle": "Hands-on projects, Video tutorials",
                "timeCommitment": "10 hours/week",
                "learningPreferences": "Coding exercises, Case studies",
                "endGoalMotivation": "Career change to a tech role",
                "notificationsPreference": "Yes"
            }
        }
    )

class UserProfileInDB(UserProfileSchema):
    user_id: str = Field(..., alias="_id")  # Use user_id as the document _id in MongoDB
    
    model_config = ConfigDict(
        populate_by_name=True
    )