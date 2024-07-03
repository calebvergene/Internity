# 1. starting with configuration

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # disables CORS error to communicate with front end

# specifying location of local sqlite database 
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# creates database instance, giving us access to the database above 
db = SQLAlchemy(app)