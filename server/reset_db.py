import os
import shutil
from flask_migrate import init, migrate, upgrade

from app import create_app, db
from models import Log, Payload, User

def reset_database():
    """Reset database and migrations completely"""
    app = create_app()
    
    with app.app_context():
        # Remove existing database file
        db_path = os.path.join('instance', 'db.sqlite3')
        if os.path.exists(db_path):
            os.remove(db_path)
            print("Removed existing database file.")
        
        # Remove migrations directory
        if os.path.exists('migrations'):
            shutil.rmtree('migrations')
            print("Removed migrations directory.")
        
        # Create instance directory if it doesn't exist
        os.makedirs('instance', exist_ok=True)
        
        # Initialize fresh migrations
        init()
        print("Initialized fresh migrations.")
        
        # Create initial migration
        migrate(message='Initial migration')
        print("Created initial migration.")
        
        # Apply the migration
        upgrade()
        print("Applied initial migration. Database is ready!")

if __name__ == "__main__":
    reset_database()
