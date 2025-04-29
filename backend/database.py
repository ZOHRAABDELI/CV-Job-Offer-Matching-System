# Database setup
# create your local database 
# pip install fastapi sqlalchemy alembic psycopg2-binary
# alembic init alembic

# import os 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy

# to be changes to use environment variables 
# SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

SQLALCHEMY_DATABASE_URL = "postgresql://avnadmin:AVNS_j5vN4noebJvKerOXwic@pg-1a5c46b8-ensia-ec92.c.aivencloud.com:19034/defaultdb?sslmode=require"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = sqlalchemy.orm.declarative_base()