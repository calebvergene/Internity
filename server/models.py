# 2. database models, knowing what fields and info we need in our db
import sys
import os
#this is our db instance, giving us access to SQLAlchemy
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server import db

# python class that inherits the characteristics of the SQL database
class Application(db.Model):
    # now, in python code, we can define the fields that we want the db to have
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(60), unique = False, nullable = False)
    name = db.Column(db.String(60), unique = False, nullable = False)
    open = db.Column(db.String(200), unique = False, nullable = True)
    close = db.Column(db.String(60), unique = False, nullable = False)
    link = db.Column(db.String(400), unique = False, nullable = True)
    google_id = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, nullable=False, default=0)


    # this method takes all of our fields, converts into python dict,
    # then coverts to json to pass from our api to our front end.
    def to_json(self):
        return {
            "id": self.id,
            "status": self.status,
            "name": self.name, 
            "open": self.open,
            "close": self.close,
            "link": self.link,  
            "google_id": self.google_id,
            'order': self.order,
        }