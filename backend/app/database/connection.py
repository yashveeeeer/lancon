import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv() 


# IMPORTANT: Replace the placeholder with your MongoDB Atlas connection string.
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = "LanCon"

# Create a new client and connect to the server
client = AsyncIOMotorClient(MONGO_URL, server_api=ServerApi('1'))
database = client.get_database(DB_NAME) # This will use the database name from your URI
user_collection = database.get_collection("users")
message_collection = database.get_collection("messages")

async def test_db_connection():
    """Sends a ping to confirm a successful connection."""
    try:
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return False
    

