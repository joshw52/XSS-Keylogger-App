import os
from flask_migrate import init, migrate, upgrade

from app import create_app, db
from models import Log, Payload, User

def deploy():
    app = create_app()
    app.app_context().push()
    
    # Check if migrations directory exists
    migrations_dir = os.path.join(os.getcwd(), 'migrations')
    
    if not os.path.exists(migrations_dir):
        # First time setup - initialize migrations
        print("Initializing migrations...")
        init()
        # Create initial migration
        migrate(message='Initial migration')
        # Apply the migration
        upgrade()
    else:
        # Migrations exist, try to upgrade
        try:
            print("Applying migrations...")
            upgrade()
        except Exception as e:
            print(f"Migration failed: {e}")
            print("Falling back to manual table creation...")
            # If migrations fail, create tables manually
            db.create_all()
    
deploy()
