from pydantic import BaseModel, Field
from typing import List, Optional

class CVFile(BaseModel):
    filename: str
    content: str  # Base64 encoded content
    type: str

class Weights(BaseModel):
    experience: int = Field(ge=0, le=100)
    jobDescription: int = Field(ge=0, le=100)
    education: int = Field(ge=0, le=100)
    skills: int = Field(ge=0, le=100)

class JobPosting(BaseModel):
    jobTitle: str
    location: str
    positions: int = Field(gt=0)
    yearsOfExperience: int = Field(ge=0)
    education: str
    requirements: List[str]
    experienceDetails: List[str]
    skills: List[str]
    languages: List[str]
    weights: Weights
    cvFiles: Optional[List[CVFile]] = None
