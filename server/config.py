import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# Specify the location of the local SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///b.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Create database instance
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Set secret key from environment variable
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'default-secret-key')
