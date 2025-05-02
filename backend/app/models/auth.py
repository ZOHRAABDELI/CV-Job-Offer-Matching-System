from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database.database import Base

# SQLAlchemy Models
class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(Text, nullable=False, unique=True, index=True)
    user_password = Column(Text, nullable=False)
    user_name = Column(Text, nullable=False)

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

# Pydantic Models
class UserBase(BaseModel):
    user_email: EmailStr
    user_name: str

class UserCreate(UserBase):
    password: str
    confirm_password: str
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserLogin(BaseModel):
    user_email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserResponse(UserBase):
    user_id: int
    
    class Config:
        orm_mode = True
