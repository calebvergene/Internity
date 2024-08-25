"""
Code to set up universal application database. Has code to add and modify the database through python. 

Designed to scale for the future, planning to add more applications to this database. 
"""

import sqlite3
from flask import Flask, jsonify
import json

app = Flask(__name__)

def create_database(db_name='applications.db'):
    # Connect to the database (or create it)
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Create the applications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            role TEXT NOT NULL,
            skills TEXT,  -- Store as a comma-separated string
            link TEXT NOT NULL,
            apply_link TEXT,
            field TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()



def insert_application(db_name, name, location, role, skills, link, apply_link, field):
    # Blacklist
    if name in ["Dell Technologies", "BlackHawk Network", "ConocoPhillips"]:
        return  
    if "Harris" in name.split():
         name = "Harris Corp"

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Convert skills list to a comma-separated string
    skills_str = ','.join(skills)

    # Check if the application already exists in the database
    cursor.execute('''
        SELECT COUNT(*) FROM applications 
        WHERE name = ? AND location = ? AND role = ? AND link = ?
    ''', (name, location, role, link))

    count = cursor.fetchone()[0]

    if count == 0:
        # Insert the application into the table only if it doesn't exist
        cursor.execute('''
            INSERT INTO applications (name, location, role, skills, link, apply_link, field)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (name, location, role, skills_str, link, apply_link, field))

    # Commit and close the connection
    conn.commit()
    conn.close()




def get_applications(db_name='applications.db'):
    """
    Retrieve all applications from the table
    """
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Retrieve all applications
    cursor.execute('SELECT * FROM applications')
    applications = cursor.fetchall()

    # Convert skills back to a list
    applications_list = []
    for application in applications:
        app_dict = {
            'id': application[0],
            'name': application[1],
            'location': application[2],
            'role': application[3],
            'skills': application[4].split(','),  # Convert skills back to list
            'link': application[5],
            'apply_link': application[6],
            'field': application[7]
        }
        applications_list.append(app_dict)

    conn.close()
    return applications_list

# Flask route to get all applications
@app.route('/applications', methods=['GET'])
def get_all_applications():
    applications = get_applications('applications.db')
    return applications

# Initialize the database and Flask app
if __name__ == '__main__':
    create_database()  
    with open('server/application_data/extracted_swe_jobs.json', 'r') as file:
                all_applications = json.load(file)
                for application in all_applications:                       
                    insert_application(
                        db_name='applications.db',
                        name=application['name'],
                        location=application['location'],
                        role=application['job_title'],
                        skills=application['skills'],
                        link=application['link'],
                        apply_link=application['apply_link'],
                        field = application['field']
                    )
    app.run(debug=True)  
