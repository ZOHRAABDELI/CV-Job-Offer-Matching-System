import sys
from sqlalchemy import text
from .database import engine, Base

def init_db():
    """Initialize the database by creating all tables."""
    try:
        # Test database connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Database connection successful!")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        
        return True
    except Exception as e:
        print(f"Error initializing database: {e}")
        return False

if __name__ == "__main__":
    if init_db():
        print("Database initialization completed successfully.")
    else:
        print("Database initialization failed.")
        sys.exit(1)
