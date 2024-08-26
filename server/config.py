import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'default-secret-key')

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///b.db"
    DEBUG = True

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://caleb@localhost/mydb'
    DEBUG = False
