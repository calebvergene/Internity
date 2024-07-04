# 3. For main, think of all of the features we need. 
# We need to create, read, update, and delete rows of our tracker.

from flask import request, jsonify
from config import app, db
from models import Application



# This is made to read the applications. If the front end requests
# to see an application, this is what is sent. 
@app.route("/applications", methods=["GET"])
def get_applications():
    # need to take each application from the db and return it as a json
    applications = Application.query.all()
    json_applications = list(map(lambda x: x.to_json(), applications))
    return jsonify({"applications": json_applications})



# This is made to create an application. We recieve json request from the 
# front end, then create the application on the back end. 
@app.route("/create_application", methods=["POST"])
def create_applications():
    name = request.json.get("name")
    open = request.json.get("open")
    close = request.json.get("close")
    link = request.json.get("link")

    if name is None or close is None: 
        return (
            jsonify({"message": "you must include a name and a date for when the applications close."}),
            400,
        )
    
    ## ERROR: could raise error here if open or link is None. refer back to this.

    new_application = Application(status="Not Applied", name=name, open=open, close=close, link=link)
    try: 
        db.session.add(new_application)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": f"Application could not be created {str(e)}"}), 400

    return jsonify({"message": "Application created successfully."}), 201
    


# This is to update an application
@app.route("/update_application/<int:user_id>", methods=["PATCH"])
def update_application(user_id):
    application = Application.query.get(user_id)

    # If given a non existant application ID
    if not application: 
        return jsonify({"message": "Application not found."}), 404
    
    data = request.json
    application.name = data.get("name", application.name)
    application.open = data.get("open", application.open)
    application.close = data.get("close", application.close)
    application.link = data.get("link", application.link)

    # since the application variable already existed in the db, all we 
    # have to do is commit the session.
    db.session.commit()

    return jsonify({"message": "Application updated."}), 200



# This is to delete an application
@app.route("/delete_application/<int:user_id>", methods=["DELETE"])
def delete_application(user_id):
    application = Application.query.get(user_id)

    # If given a non existant application ID
    if not application: 
        return jsonify({"message": "Application not found."}), 404
    
    db.session.delete(application)
    db.session.commit()

    return jsonify({"message": "Application deleted."}), 200



if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)