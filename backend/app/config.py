import os
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

# Define configuration class
class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret key for sessions and security
    SECRET_KEY = os.getenv("SECRET_KEY") or 'supersecretkey'

    # Optional: Print database being used (for debugging)
    print(f"📦 Using database: {SQLALCHEMY_DATABASE_URI}")
