# database.py
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

dotenv_loaded = load_dotenv()

MONGODB_URL_FROM_ENV = os.getenv("MONGODB_URL")
DATABASE_NAME_FROM_ENV = os.getenv("DATABASE_NAME")

print(f"--- DEBUG (database.py) ---")
print(f"Attempted to load .env file: {dotenv_loaded}")
print(f"MONGODB_URL from environment (before client init): {MONGODB_URL_FROM_ENV}") # Renamed for clarity
print(f"DATABASE_NAME from environment: {DATABASE_NAME_FROM_ENV}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"--- END DEBUG (database.py) ---")


if not MONGODB_URL_FROM_ENV:
    raise ValueError("MONGODB_URL not set. Check .env file and its location.")
if not DATABASE_NAME_FROM_ENV:
    raise ValueError("DATABASE_NAME not set. Check .env file.")

# Initialize client with the URI from .env
client = AsyncIOMotorClient(MONGODB_URL_FROM_ENV)
print(f"--- DEBUG (database.py after client init) ---")
print(f"Client object created. Client.HOST: {client.HOST}, Client.PORT: {client.PORT}")
print(f"Client.nodes: {client.nodes}") # See what nodes it knows about immediately
print(f"--- END DEBUG (database.py after client init) ---")


db = client[DATABASE_NAME_FROM_ENV]
user_profiles_collection = db["user_profiles"]

async def get_db_client():
    # For debugging, let's also return the URI that was supposedly used.
    # This MONGODB_URL_FROM_ENV is from the module's global scope when client was created.
    return client, MONGODB_URL_FROM_ENV

async def close_db_client():
    if client: # Check if client exists before trying to close
        client.close()