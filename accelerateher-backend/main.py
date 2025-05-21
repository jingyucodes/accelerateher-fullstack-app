from fastapi import FastAPI, HTTPException, Path, Body, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging
from datetime import datetime, timezone # For adding a timestamp

from models import UserProfileSchema, UserProfileInDB
from database import user_profiles_collection, get_db_client, close_db_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__) # Use 'main' or __name__ for the logger

app = FastAPI(title="AccelerateHer User Profile API")

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:5173", # Your Vite React frontend
    "http://localhost:3000", # Common port for Create React App
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

# --- MODIFIED PUT ENDPOINT ---
@app.put("/api/profile/{user_id}", response_model=UserProfileInDB, status_code=status.HTTP_200_OK)
async def upsert_user_profile(
    user_id: str = Path(..., title="The ID of the user to create/update"),
    profile_data: UserProfileSchema = Body(...)
):
    logger.info(f"PUT /api/profile/{user_id} - Upserting profile.")
    logger.debug(f"PUT /api/profile/{user_id} - Received profile_data: {profile_data.model_dump()}")
    
    profile_dict = profile_data.model_dump(exclude_unset=True) # Get only fields that were sent
    logger.debug(f"PUT /api/profile/{user_id} - Profile dictionary to $set (after exclude_unset): {profile_dict}")

    # If profile_dict is empty after exclude_unset, MongoDB might not create a meaningful document,
    # or it might just create one with _id. To ensure some data is written on creation if
    # the payload was all defaults that got excluded:
    if not profile_dict and not await user_profiles_collection.find_one({"_id": user_id}):
        logger.warning(f"PUT /api/profile/{user_id} - Profile dictionary for $set is empty and profile does not exist. Setting a creation timestamp.")
        # Forcing a field to ensure document creation if it's a new profile with empty data
        profile_dict_to_set = {"_created_at_on_empty_upsert": datetime.now(timezone.utc)}
        # You could also set all default values from UserProfileSchema if desired
        # profile_dict_to_set = profile_data.model_dump() # This would include defaults
    else:
        profile_dict_to_set = profile_dict

    if not profile_dict_to_set and await user_profiles_collection.find_one({"_id": user_id}):
        logger.info(f"PUT /api/profile/{user_id} - Profile exists and payload to set is empty. No update will occur beyond _id match.")
        # In this case, we can just fetch and return the existing one, as $set with empty dict does nothing.
        # However, motor's update_one with upsert=True should still report matched_count=1 if it exists.

    try:
        update_result = await user_profiles_collection.update_one(
            {"_id": user_id},
            {"$set": profile_dict_to_set}, # Use the potentially modified dict
            upsert=True
        )
        logger.info(f"PUT /api/profile/{user_id} - MongoDB update_one result: matched_count={update_result.matched_count}, modified_count={update_result.modified_count}, upserted_id={update_result.upserted_id}")

    except Exception as e_update:
        logger.error(f"PUT /api/profile/{user_id} - Exception during MongoDB update_one: {e_update}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error saving profile to database.")

    if not (update_result.matched_count > 0 or update_result.upserted_id):
        # This case means MongoDB didn't match an existing document and also didn't insert a new one.
        # This is unusual with upsert=True unless the $set operation was truly empty and it's an update.
        logger.error(f"PUT /api/profile/{user_id} - Failed to upsert profile. No match or upsert indicated by MongoDB result.")
        # For a PUT, if upsert was intended, this should ideally not happen if an ID is provided.
        # It might be better to return a 500 if the DB operation didn't behave as expected.
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Profile could not be saved (no match or upsert).")

    # Fetch the (potentially updated or newly created) document to return it
    logger.debug(f"PUT /api/profile/{user_id} - Attempting to retrieve profile after upsert...")
    created_or_updated_profile_doc = await user_profiles_collection.find_one({"_id": user_id})

    if created_or_updated_profile_doc:
        logger.info(f"PUT /api/profile/{user_id} - Successfully retrieved profile after upsert. Returning document.")
        return UserProfileInDB(**created_or_updated_profile_doc)
    else:
        # This is the problematic 404 source for PUT
        logger.error(f"PUT /api/profile/{user_id} - CRITICAL: Could not retrieve profile for user_id: {user_id} immediately after successful-looking upsert. This should not happen.")
        # This indicates a more severe issue if the upsert reported success but find_one fails.
        # Perhaps a read-after-write consistency issue (unlikely on M0 for this simple case) or DB error.
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Profile operation inconsistency for user {user_id}.")


@app.get("/api/profile/{user_id}", response_model=UserProfileInDB)
async def get_user_profile(user_id: str = Path(..., title="The ID of the user to retrieve")):
    logger.info(f"GET /api/profile/{user_id} - Fetching profile.")
    if not app.mongodb_client: # Check if client is available
        logger.error(f"GET /api/profile/{user_id} - MongoDB client not initialized.")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database service not available.")
    
    try:
        profile_doc = await user_profiles_collection.find_one({"_id": user_id})
    except Exception as e_find:
        logger.error(f"GET /api/profile/{user_id} - Exception during MongoDB find_one: {e_find}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving profile from database.")

    if profile_doc:
        logger.info(f"GET /api/profile/{user_id} - Profile found.")
        return UserProfileInDB(**profile_doc)
    
    logger.warning(f"GET /api/profile/{user_id} - Profile not found.")
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User profile with ID {user_id} not found")

@app.get("/")
async def read_root():
    return {"message": "Welcome to AccelerateHer User Profile API!"}

# To run the server: uvicorn main:app --reload