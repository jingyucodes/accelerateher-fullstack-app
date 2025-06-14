#!/usr/bin/env python3
"""
Script to remove unused fields (bio, interests, goals) from existing user profiles in MongoDB.
Run this once to clean up the database after removing these fields from the model.
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "accelerateher")

async def cleanup_unused_fields():
    """Remove bio, interests, and goals fields from all user profiles"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    profiles_collection = db["user_profiles"]
    
    try:
        # Remove the unused fields from all documents
        result = await profiles_collection.update_many(
            {},  # Match all documents
            {
                "$unset": {
                    "bio": "",
                    "interests": "",
                    "goals": ""
                }
            }
        )
        
        print(f"✅ Successfully cleaned up {result.modified_count} user profiles")
        print(f"   Removed fields: bio, interests, goals")
        
        # Verify the cleanup by checking a few profiles
        sample_profiles = await profiles_collection.find({}).limit(3).to_list(length=3)
        
        print(f"\n📋 Sample profiles after cleanup:")
        for i, profile in enumerate(sample_profiles, 1):
            print(f"   Profile {i}: {profile.get('user_id', 'Unknown')}")
            removed_fields = []
            if 'bio' not in profile:
                removed_fields.append('bio')
            if 'interests' not in profile:
                removed_fields.append('interests') 
            if 'goals' not in profile:
                removed_fields.append('goals')
            
            if removed_fields:
                print(f"     ✅ Removed: {', '.join(removed_fields)}")
            else:
                print(f"     ⚠️  Still has unused fields")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
    
    finally:
        # Close the connection
        client.close()
        print(f"\n🔌 Database connection closed")

if __name__ == "__main__":
    print("🧹 Starting database cleanup...")
    print("   Removing unused fields: bio, interests, goals")
    print("   From collection: user_profiles")
    print()
    
    asyncio.run(cleanup_unused_fields())
    
    print("\n✨ Cleanup completed!")
    print("   These fields will no longer be stored for new profiles.") 