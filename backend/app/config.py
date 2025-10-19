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
    @staticmethod
    def init_app(app):
        print(f"📦 Using database: {Config.SQLALCHEMY_DATABASE_URI}")
        print(f"🔧 Debug mode: {Config.DEBUG}")
