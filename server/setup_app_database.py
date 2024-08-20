import sqlite3
from flask import Flask, jsonify

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
            app_link TEXT NOT NULL,
            field TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()



def insert_application(db_name, name, location, role, skills, link, app_link, field):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Convert skills list to a comma-separated string
    skills_str = ','.join(skills)

    # Insert the application into the table
    cursor.execute('''
        INSERT INTO applications (name, location, role, skills, link, app_link, field)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (name, location, role, skills_str, link, app_link, field))

    # Commit and close the connection
    conn.commit()
    conn.close()


def get_applications(db_name):
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
            'app_link': application[6],
            'field': application[7]
        }
        applications_list.append(app_dict)

    conn.close()
    return applications_list

# Flask route to get all applications
@app.route('/applications', methods=['GET'])
def get_all_applications():
    applications = get_applications('applications.db')
    return jsonify(applications)

# Initialize the database and Flask app
if __name__ == '__main__':
    create_database()  # Create the database and table
    # Example of inserting an application
    insert_application(
        db_name='applications.db',
        name='Software Engineer Intern',
        location='Cambridge, MA',
        company='Philips',
        skills=['Python', 'SQL', 'Java'],
        link='https://jobright.ai/jobs/info/66be7dfc0b2da45a95d15e21?utm_source=1099&utm_campaign=Software Engineer'
    )
    app.run(debug=True)  # Run the Flask app
