from config import db, app
from sqlalchemy.sql import text

def add_role_column():
    with app.app_context():
        # Add the new column to the Application table
        db.session.execute(text('ALTER TABLE application ADD COLUMN "role" STRING'))
        db.session.commit()

if __name__ == '__main__':
    add_role_column()
