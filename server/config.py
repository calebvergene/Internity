import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Disable CORS errors to communicate with the front end


# Specify the location of the local SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///b.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Create database instance
db = SQLAlchemy(app)

# Set secret key from environment variable
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'default-secret-key')
