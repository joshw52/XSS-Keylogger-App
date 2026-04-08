import os
from flask_migrate import init, migrate, stamp, upgrade

from app import create_app, db
from models import Log, Payload, User

def deploy():
    app = create_app()
    app.app_context().push()
    
    migrations_dir = os.path.join(os.getcwd(), 'migrations')
    versions_dir = os.path.join(migrations_dir, 'versions')
    has_versions = os.path.exists(versions_dir) and any(
        f.endswith('.py') for f in os.listdir(versions_dir)
    )

    if not os.path.exists(migrations_dir) or not has_versions:
        # First time setup - no migrations exist
        print("Setting up database for the first time...")
        
        # Create tables manually first
        db.create_all()
        print("Tables created.")
        
        # Initialize migrations only if the directory doesn't exist yet
        if not os.path.exists(migrations_dir):
            init()
            print("Migrations initialized.")
        
        # Mark current schema as up-to-date (no migration needed)
        stamp()
        print("Database marked as up-to-date.")
        
    else:
        # Migrations directory exists with versions
        print("Migrations directory found. Attempting to upgrade...")
        try:
            # Try to apply any pending migrations
            upgrade()
            print("Database upgraded successfully.")
        except Exception as e:
            print(f"Migration upgrade failed: {e}")
            print("Attempting to create tables manually...")
            # If upgrade fails, create tables manually as fallback
            db.create_all()
            print("Tables created manually.")

if __name__ == "__main__":
    deploy()
