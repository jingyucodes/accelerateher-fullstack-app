from pydantic import BaseModel, Field
from typing import Optional

class UserProfileSchema(BaseModel):
    # user_id will be part of the URL path, not usually in the body for updates
    name: Optional[str] = "Learner"
    futureSkills: Optional[str] = ""
    currentSkills: Optional[str] = ""
    preferredLearningStyle: Optional[str] = ""
    timeCommitment: Optional[str] = ""
    learningPreferences: Optional[str] = ""
    endGoalMotivation: Optional[str] = ""
    notificationsPreference: Optional[str] = ""

    class Config:
        allow_population_by_field_name = True
        json_schema_extra = {
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

class UserProfileInDB(UserProfileSchema):
    user_id: str = Field(..., alias="_id") # Use user_id as the document _id in MongoDB