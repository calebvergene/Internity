# 3. For main, think of all of the features we need. 
# We need to create, read, update, and delete rows of our tracker.
from sqlalchemy import case, asc, desc
from config import app, db
from models import Application
from default_apps import default_apps

import os
import pathlib
import logging

import requests
from dotenv import load_dotenv
from flask import session, abort, redirect, request, jsonify
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
from pip._vendor import cachecontrol
from functools import wraps

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', 'default-client-id')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', 'default-client-secret')
# change to environment variable before production!

#print(f"GOOGLE_CLIENT_ID: {GOOGLE_CLIENT_ID}")
#print(f"GOOGLE_CLIENT_SECRET: {GOOGLE_CLIENT_SECRET}")

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:5001/callback"
)

logging.basicConfig(level=logging.DEBUG)

def login_is_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)  # Authorization required
        else:
            return function(*args, **kwargs)

    return wrapper

@app.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    logging.debug(f"Authorization URL: {authorization_url}")
    logging.debug(f"Generated state: {state}")
    session["state"] = state
    logging.debug(f"Session state set: {session['state']}")
    return redirect(authorization_url)

@app.route("/callback", methods=["GET"])
def callback():
    try:
        logging.debug(f"Callback request.args: {request.args}")
        logging.debug(f"Session state set: {session['state']}")
        logging.debug(f"Request state set: {request.args['state']}")
        # Check if 'state' is in session
        if 'state' not in session:
            logging.error("State not found in session.")
            return abort(400)  # Bad request if state is missing in session

        # Check if 'state' is in request.args
        if 'state' not in request.args:
            logging.error("State not found in request arguments.")
            return abort(400)  # Bad request if state is missing in request arguments

        # Compare session state with request state
        if session["state"] != request.args["state"]:
            logging.error("State mismatch. Session state: %s, Request state: %s", session["state"], request.args["state"])
            abort(500)  # State does not match!

        #session["state"] = request.args["state"]

        flow.fetch_token(authorization_response=request.url)

        credentials = flow.credentials
        logging.debug(f"Credentials: {credentials}")

        request_session = requests.session()
        cached_session = cachecontrol.CacheControl(request_session)
        token_request = google.auth.transport.requests.Request(session=cached_session)

        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token_request,
            audience=GOOGLE_CLIENT_ID
        )

        logging.debug(f"ID Info: {id_info}")

        session["google_id"] = id_info.get("sub")
        session["name"] = id_info.get("name")

        # Check if the user already has any applications
        existing_applications = Application.query.filter_by(google_id=session["google_id"]).first()

        if not existing_applications:
            # No existing applications, run default applications setup
            default_applications(session["google_id"])

        return redirect("http://localhost:3000")
    except Exception as e:
        logging.error(f"Error during callback: {e}")
        return abort(500)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

# This is made to read the applications. If the front end requests
# to see an application, this is what is sent. 
@app.route("/application", methods=["GET"])
@login_is_required
def get_applications():
    google_id = session["google_id"]
    custom_sort = request.args.get("custom_sort", "")

    query = Application.query.filter_by(google_id=google_id)

    if custom_sort == "Not Applied":
        order_by_status = case(
            
                (Application.status == 'Not Applied', 1),
                (Application.status == 'Applied', 2),
                (Application.status == 'Interviewing', 3),
                (Application.status == 'Offered', 4)
            ,
            else_=5
        )
        query = query.order_by(order_by_status, desc(Application.id))
    elif custom_sort == "Offered":
        order_by_status = case(
            
                (Application.status == 'Offered', 1),
                (Application.status == 'Interviewing', 2),
                (Application.status == 'Applied', 3),
                (Application.status == 'Not Applied', 4)
            ,
            else_=5
        )
        query = query.order_by(order_by_status, desc(Application.id))
    else:
        query = query.order_by(Application.order.asc(), desc(Application.id))  # Default sorting

    applications = query.all()

    # Update the order field in the database
    for index, application in enumerate(applications):
        application.order = index
    db.session.commit()

    json_applications = [application.to_json() for application in applications]
    user_name = session["name"]
    
    return jsonify({"applications": json_applications, "userName": user_name})



# This is made to create an application. We recieve json request from the 
# front end, then create the application on the back end. 
@app.route("/create_application", methods=["POST"])
@login_is_required
def create_applications():
    name = request.json.get("name")
    open = request.json.get("open")
    close = request.json.get("close")
    link = request.json.get("link")

    if name is None or close is None: 
        return (
            jsonify({"message": "You must include a name and a date for when the applications close."}),
            400,
        )
    
    ## ERROR: could raise error here if open or link is None. refer back to this.
    google_id = session["google_id"]

    new_application = Application(status="Not Applied", name=name, open=open, close=close, link=link, google_id=google_id)
    try: 
        db.session.add(new_application)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": f"Application could not be created {str(e)}"}), 400

    return jsonify({"message": "Application created successfully."}), 201
    


# This is to update an application
@app.route("/update_application/<int:user_id>", methods=["PATCH"])
@login_is_required
def update_application(user_id):
    application = Application.query.filter_by(id=user_id, google_id=session["google_id"]).first()

    # If given a non existant application ID
    if not application: 
        return jsonify({"message": "Application not found."}), 404
    
    data = request.json
    application.name = data.get("name", application.name)
    application.open = data.get("open", application.open)
    application.close = data.get("close", application.close)
    application.link = data.get("link", application.link)
    application.status = data.get("status", application.status)

    # since the application variable already existed in the db, all we 
    # have to do is commit the session.
    db.session.commit()

    return jsonify({"message": "Application updated."}), 200



# This is to delete an application
@app.route("/delete_application/<int:user_id>", methods=["DELETE"])
@login_is_required
def delete_application(user_id):
    application = Application.query.filter_by(id=user_id, google_id=session["google_id"]).first()


    # If given a non existant application ID
    if not application: 
        return jsonify({"message": "Application not found."}), 404
    
    db.session.delete(application)
    db.session.commit()

    return jsonify({"message": "Application deleted."}), 200



def default_applications(google_id):
    try:
        # Add the default applications to the database
        db.session.bulk_save_objects(default_apps(google_id))
        db.session.commit()
        
        print("Default applications created for user:", google_id)
    except Exception as e:
        print("Error creating default applications:", e)




if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5001)
