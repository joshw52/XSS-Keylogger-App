from app import create_app, db
from models import Log, Payload, User

def setup_database():
    """Simple database setup without migrations"""
    app = create_app()
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()
        print("Database tables created successfully!")

if __name__ == "__main__":
    setup_database()
