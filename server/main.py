# 3. For main, think of all of the features we need. 
# We need to create, read, update, and delete rows of our tracker.
from sqlalchemy import case, asc, desc
from models import Application
from default_apps import default_apps
from file_analysis import analyze_resume

import os
import pathlib
import sys
import logging

import requests
from dotenv import load_dotenv
from flask import session, abort, redirect, request, jsonify
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
from pip._vendor import cachecontrol
from functools import wraps
from file_analysis import extract_skills
from default_apps import skill_set
from config import DevelopmentConfig, ProductionConfig
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server import create_app, db


load_dotenv()


app = create_app()


GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', 'default-client-id')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', 'default-client-secret')
# change to environment variable before production!

# Set the upload folder path
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
    """
    Enforces login state
    """
    @wraps(function)
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)  # Authorization required
        else:
            return function(*args, **kwargs)

    return wrapper


@app.route("/login")
def login():
    """
    Allows users to log in
    """
    authorization_url, state = flow.authorization_url()
    logging.debug(f"Authorization URL: {authorization_url}")
    logging.debug(f"Generated state: {state}")
    session["state"] = state
    logging.debug(f"Session state set: {session['state']}")
    return redirect(authorization_url)


@app.route("/callback", methods=["GET"])
def callback():
    """
    Google auth page
    """
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
    """
    To logout of session/account
    """
    session.clear()
    return redirect("/login")


# This is made to read the applications. If the front end requests
# to see an application, this is what is sent. 
@app.route("/application", methods=["GET"])
@login_is_required
def get_applications():
    """
    Receive applications from database to send to front end
    Has additional sort features based off front end input
    """
    google_id = session["google_id"]
    custom_sort = request.args.get("custom_sort", "")

    query = Application.query.filter_by(google_id=google_id)

    if custom_sort == "Not Applied":
        order_by_status = case(
            (Application.status == 'Not Applied', 1),
            (Application.status == 'Applied', 2),
            (Application.status == 'Interviewing', 3),
            (Application.status == 'Offered', 4),
            else_=5
        )
        query = query.order_by(order_by_status, desc(Application.id))
        
    elif custom_sort == "Applied":
        order_by_status = case(
            (Application.status == 'Applied', 1),
            (Application.status == 'Interviewing', 2),
            (Application.status == 'Offered', 3),
            (Application.status == 'Not Applied', 4),
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
    elif custom_sort == "Similarity":
        try:
            applications = query.all()

            def get_similarity_value(app):
                try:
                    # Finds similarity in app. Added error handling
                    return float(app.link.split()[-1]) if app.link and float(app.link.split()[-1]) else float(0)
                except (ValueError, IndexError) as e:
                    print(e)
                    return float(0)

            
            # Sort the applications in Python by the similarity value
            sorted_applications = sorted(applications, key=get_similarity_value, reverse=True)

            order_case = case(
                {app.id: index + 1 for index, app in enumerate(sorted_applications)},
                value=Application.id
            )

            query = query.order_by(order_case)

        except Exception as e:
            print(f'Error sorting by similarity: {e}')

    else:
        query = query.order_by(Application.order.asc(), desc(Application.id))  # Default sorting

    # Fetch the sorted applications
    applications = query.all()

    # Update the order field in the database
    for index, application in enumerate(applications):
        application.order = index + 1  # Adjust index to start from 1 if needed
    db.session.commit()

    json_applications = [application.to_json() for application in applications]
    user_name = session["name"]

    return jsonify({"applications": json_applications, "userName": user_name})


@app.route("/create_application", methods=["POST"])
@login_is_required
def create_applications():
    """
    To create an application. We receive json request from the front end, then create the application on the back end. 
    """
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
    

@app.route("/update_application/<int:user_id>", methods=["PATCH"])
@login_is_required
def update_application(user_id):
    """
    Update an existing application and replace the old one with new info in their database
    """
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


@app.route("/delete_application/<int:user_id>", methods=["DELETE"])
@login_is_required
def delete_application(user_id):
    """
    Deletes an application from their database
    """
    application = Application.query.filter_by(id=user_id, google_id=session["google_id"]).first()


    # If given a non existant application ID
    if not application: 
        return jsonify({"message": "Application not found."}), 404
    
    db.session.delete(application)
    db.session.commit()

    return jsonify({"message": "Application deleted."}), 200

# This is for uploading resume from front end
@app.route('/upload-resume', methods=['POST'])
def upload_resume():
    """
    Receives resume file from the front end
    Sends resume to backend to process and analyze file
    upload_resume() receives parsed text and runs analysis to generate a similarity score
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    similarity_scores = analyze_resume(file)
    applications = Application.query.filter_by(google_id=session["google_id"]).all()
    resume_skills = extract_skills(file, skill_set())
    if not applications:
        return jsonify({"message": "No applications found."}), 404

    for application in applications:
        # Iterate over similarity_scores to find a match
        for sim_app in similarity_scores:
            if (
                application.name == sim_app["name"] and
                application.open == sim_app["role"] and
                application.close == sim_app["location"]
            ):
                if application.link == None:
                    continue
                application.link = application.link + ' ' + sim_app['similarity']

    # Commit the changes to the database if any updates were made
    db.session.commit()

    return jsonify({'skills': list(resume_skills)}), 200


def default_applications(google_id):
    """
    Starts off the user with the web scraped internships that align with their chosen major. If the user
    has 0 internships in their table, then this function will run and automatically add applications to their 
    database and front end table. 
    """
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

    app.run(debug=False, port=5001)
