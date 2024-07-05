# 2. database models, knowing what fields and info we need in our db

#this is our db instance, giving us access to SQLAlchemy
from config import db

# python class that inherits the characteristics of the SQL database
class Application(db.Model):
    # now, in python code, we can define the fields that we want the db to have
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(60), unique = False, nullable = False)
    name = db.Column(db.String(60), unique = False, nullable = False)
    open = db.Column(db.String(60), unique = False, nullable = True)
    close = db.Column(db.String(60), unique = False, nullable = False)
    link = db.Column(db.String(200), unique = False, nullable = True)

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
        }