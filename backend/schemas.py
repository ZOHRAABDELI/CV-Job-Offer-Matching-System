# schemas.py - Pydantic models for request/response validation
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

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