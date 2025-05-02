# Define models here 
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(Text, nullable=False, unique=True, index=True)
    user_password = Column(Text, nullable=False)

class JobOffer(Base):
    __tablename__ = "job_offer"
    
    job_id = Column(Integer, primary_key=True, autoincrement=True)
    job_title = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)
    job_location = Column(Text, nullable=False)
    job_experience = Column(Text, nullable=False)
    job_academic_background = Column(Text, nullable=False)
    job_number_positions = Column(Integer, nullable=False)
    job_status = Column(Boolean, default=True)
    
    cvs = relationship("CV", backref="job", cascade="all, delete-orphan")
    cv_job_matchings = relationship("CVJobMatching", backref="job", cascade="all, delete-orphan")

class CV(Base):
    __tablename__ = "cv"
    
    cv_id = Column(Integer, primary_key=True, autoincrement=True)
    cv_title = Column(Text, nullable=False)
    job_id = Column(Integer, ForeignKey("job_offer.job_id", ondelete="CASCADE"), nullable=False)
    
    cv_job_matchings = relationship("CVJobMatching", backref="cv", cascade="all, delete-orphan")

class CVJobMatching(Base):
    __tablename__ = "cv_job_matching"
    
    cv_job_matching_id = Column(Integer, primary_key=True, autoincrement=True)
    cv_id = Column(Integer, ForeignKey("cv.cv_id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_offer.job_id", ondelete="CASCADE"), nullable=False)
    matching_score = Column(Integer, nullable=False)
    decision = Column(Boolean, default=False)