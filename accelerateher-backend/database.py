# database.py
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

dotenv_loaded = load_dotenv()

MONGODB_URL_FROM_ENV = os.getenv("MONGODB_URL")
DATABASE_NAME_FROM_ENV = os.getenv("DATABASE_NAME")

logger.info(f"--- DEBUG (database.py) ---")
logger.info(f"Attempted to load .env file: {dotenv_loaded}")
logger.info(f"MONGODB_URL from environment (before client init): {MONGODB_URL_FROM_ENV}")
logger.info(f"DATABASE_NAME from environment: {DATABASE_NAME_FROM_ENV}")
logger.info(f"Current Working Directory: {os.getcwd()}")
logger.info(f"--- END DEBUG (database.py) ---")

if not MONGODB_URL_FROM_ENV:
    raise ValueError("MONGODB_URL not set. Check .env file and its location.")
if not DATABASE_NAME_FROM_ENV:
    raise ValueError("DATABASE_NAME not set. Check .env file.")

# Initialize client with the URI from .env
client = AsyncIOMotorClient(
    MONGODB_URL_FROM_ENV,
    serverSelectionTimeoutMS=60000,  # 60 seconds timeout
    connectTimeoutMS=60000,
    socketTimeoutMS=60000
)

logger.info(f"--- DEBUG (database.py after client init) ---")
logger.info(f"Client object created. Client.HOST: {client.HOST}, Client.PORT: {client.PORT}")
logger.info(f"Client.nodes: {client.nodes}")
logger.info(f"--- END DEBUG (database.py after client init) ---")

db = client[DATABASE_NAME_FROM_ENV]
user_profiles_collection = db["user_profiles"]
users_collection = db["users"]
forum_threads_collection = db["forum_threads"]
forum_replies_collection = db["forum_replies"]

async def get_db_client():
    return client, MONGODB_URL_FROM_ENV

async def close_db_client():
    if client:
        client.close()

# User operations
async def create_user(user_data: dict):
    try:
        result = await users_collection.insert_one(user_data)
        return await users_collection.find_one({"_id": result.inserted_id})
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return None

async def get_user_by_user_id(user_id_val: str):
    try:
        return await users_collection.find_one({"user_id": user_id_val})
    except Exception as e:
        logger.error(f"Error getting user by user_id '{user_id_val}': {e}")
        return None

async def get_user_by_id(mongo_db_id: str):
    try:
        return await users_collection.find_one({"_id": ObjectId(mongo_db_id)})
    except Exception as e:
        logger.error(f"Error getting user by MongoDB _id '{mongo_db_id}': {e}")
        return None

# User profile operations
async def add_user_profile(profile_data: dict):
    try:
        # The profile_data should already contain the _id field set to user_id_str by the caller (signup function)
        result = await user_profiles_collection.insert_one(profile_data)
        return await user_profiles_collection.find_one({"_id": result.inserted_id})
    except Exception as e:
        logger.error(f"Error adding user profile: {e}")
        return None

async def get_user_profile(user_id: str):
    try:
        # Now querying by _id, which should be the user_id string
        return await user_profiles_collection.find_one({"_id": user_id})
    except Exception as e:
        logger.error(f"Error getting user profile for _id {user_id}: {e}")
        return None

async def update_user_profile(user_id: str, profile_data: dict):
    try:
        logger.info(f"UPDATING USER PROFILE - user_id: {user_id}")
        logger.info(f"UPDATING USER PROFILE - data keys: {list(profile_data.keys())}")
        if 'completed_modules' in profile_data:
            logger.info(f"UPDATING USER PROFILE - completed_modules: {profile_data['completed_modules']}")
        
        # Updating based on _id, which is the user_id string
        result = await user_profiles_collection.update_one(
            {"_id": user_id},
            {"$set": profile_data}
        )
        
        logger.info(f"UPDATE RESULT - matched_count: {result.matched_count}, modified_count: {result.modified_count}")
        
        if result.matched_count > 0:
            updated_doc = await user_profiles_collection.find_one({"_id": user_id})
            if updated_doc and 'completed_modules' in profile_data:
                logger.info(f"VERIFICATION - saved completed_modules: {updated_doc.get('completed_modules', [])}")
            return updated_doc
        else:
            logger.error(f"NO DOCUMENT MATCHED for user_id: {user_id}")
        return None
    except Exception as e:
        logger.error(f"Error updating user profile for _id {user_id}: {e}")
        return None

async def update_user_analytics(user_id: str, analytics_data: dict):
    try:
        result = await user_profiles_collection.update_one(
            {"_id": user_id},
            {"$set": {"analytics": analytics_data}}
        )
        if result.matched_count > 0:
            return await user_profiles_collection.find_one({"_id": user_id})
        return None
    except Exception as e:
        logger.error(f"Error updating analytics for user profile _id {user_id}: {e}")
        return None

async def get_all_user_profiles():
    """Get all user profiles for leaderboard"""
    try:
        cursor = user_profiles_collection.find({})
        return await cursor.to_list(length=None)
    except Exception as e:
        logger.error(f"Error getting all user profiles: {e}")
        return []

# Forum operations
async def get_threads_by_topic(topic_id: str):
    try:
        cursor = forum_threads_collection.find({"topic_id": topic_id}).sort("last_activity_at", -1)
        return await cursor.to_list(length=None)
    except Exception as e:
        logger.error(f"Error getting threads for topic {topic_id}: {e}")
        return []

async def create_thread(thread_data: dict):
    try:
        result = await forum_threads_collection.insert_one(thread_data)
        return await forum_threads_collection.find_one({"_id": result.inserted_id})
    except Exception as e:
        logger.error(f"Error creating forum thread: {e}")
        return None

async def get_thread_by_id(thread_id: str):
    try:
        return await forum_threads_collection.find_one({"_id": ObjectId(thread_id)})
    except Exception as e:
        logger.error(f"Error getting thread by id {thread_id}: {e}")
        return None

async def get_replies_for_thread(thread_id: str):
    try:
        cursor = forum_replies_collection.find({"thread_id": ObjectId(thread_id)}).sort("created_at", 1)
        return await cursor.to_list(length=None)
    except Exception as e:
        logger.error(f"Error getting replies for thread {thread_id}: {e}")
        return []

async def create_reply(reply_data: dict):
    try:
        # Insert the new reply
        result = await forum_replies_collection.insert_one(reply_data)
        if result.inserted_id:
            # Update the parent thread's last_activity_at and increment reply_count
            await forum_threads_collection.update_one(
                {"_id": reply_data["thread_id"]},
                {
                    "$set": {"last_activity_at": reply_data["created_at"]},
                    "$inc": {"reply_count": 1}
                }
            )
            return await forum_replies_collection.find_one({"_id": result.inserted_id})
        return None
    except Exception as e:
        logger.error(f"Error creating reply: {e}")
        return None