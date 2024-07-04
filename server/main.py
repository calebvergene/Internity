# 3. For main, think of all of the features we need. 
# We need to create, read, update, and delete rows of our tracker.

from flask import request, jsonify
from config import app, db
from models import Application


# This is made to read the applications. 
@app.route("/applications", methods=["GET"])
def get_applications():
    # need to take each application from the db and return it as a json
    applications = Application.query.all()
    json_applications = list(map(lambda x: x.to_json(), applications))
    return jsonify({"applications": json_applications})






if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)