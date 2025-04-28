from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import json
import os
from datetime import datetime
import base64
import uuid

# Create data directory if it doesn't exist
os.makedirs("data/job_postings", exist_ok=True)
os.makedirs("data/cv_files", exist_ok=True)

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
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

@app.post("/api/job-offers")
def create_job_offer(job_posting: JobPosting = Body(...)):
    try:
        # Generate a unique ID for the job posting
        job_id = str(uuid.uuid4())
        
        # Save CV files if any
        cv_paths = []
        if job_posting.cvFiles:
            for cv_file in job_posting.cvFiles:
                # Decode base64 content
                file_content = base64.b64decode(cv_file.content)
                
                # Create a unique filename
                filename = f"{job_id}_{cv_file.filename}"
                file_path = os.path.join("data/cv_files", filename)
                
                # Save the file
                with open(file_path, "wb") as f:
                    f.write(file_content)
                
                cv_paths.append(filename)
        
        # Prepare job posting data for saving
        job_data = job_posting.dict()
        job_data["id"] = job_id
        job_data["createdAt"] = datetime.now().isoformat()
        
        # Replace the CV file content with just the filenames to avoid storing
        # large base64 strings in the JSON file
        job_data["cvFiles"] = cv_paths
        
        # Save the job posting as a JSON file
        job_file_path = os.path.join("data/job_postings", f"{job_id}.json")
        with open(job_file_path, "w") as f:
            json.dump(job_data, f, indent=2)
        
        return {"success": True, "jobId": job_id}
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating job offer: {str(e)}")
        raise HTTPException(status_code=500, message=f"Failed to create job offer: {str(e)}")

@app.get("/api/job-offers")
def get_job_offers():
    try:
        job_offers = []
        job_posting_dir = "data/job_postings"
        
        # List all JSON files in the job postings directory
        for filename in os.listdir(job_posting_dir):
            if filename.endswith(".json"):
                file_path = os.path.join(job_posting_dir, filename)
                
                with open(file_path, "r") as f:
                    job_data = json.load(f)
                    
                # Remove CV file paths for the list view
                if "cvFiles" in job_data:
                    job_data["hasCVs"] = len(job_data["cvFiles"]) > 0
                    del job_data["cvFiles"]
                    
                job_offers.append(job_data)
        
        # Sort by creation date (newest first)
        job_offers.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        
        return {"success": True, "jobOffers": job_offers}
    
    except Exception as e:
        print(f"Error getting job offers: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve job offers: {str(e)}")

@app.get("/api/job-offers/{job_id}")
def get_job_offer(job_id: str):
    try:
        job_file_path = os.path.join("data/job_postings", f"{job_id}.json")
        
        if not os.path.exists(job_file_path):
            raise HTTPException(status_code=404, detail="Job offer not found")
        
        with open(job_file_path, "r") as f:
            job_data = json.load(f)
            
        return {"success": True, "jobOffer": job_data}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting job offer {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve job offer: {str(e)}")

@app.delete("/api/job-offers/{job_id}")
def delete_job_offer(job_id: str):
    try:
        job_file_path = os.path.join("data/job_postings", f"{job_id}.json")
        
        if not os.path.exists(job_file_path):
            raise HTTPException(status_code=404, detail="Job offer not found")
        
        # Get the job data to find associated CV files
        with open(job_file_path, "r") as f:
            job_data = json.load(f)
        
        # Delete associated CV files
        if "cvFiles" in job_data:
            for cv_filename in job_data["cvFiles"]:
                cv_path = os.path.join("data/cv_files", cv_filename)
                if os.path.exists(cv_path):
                    os.remove(cv_path)
        
        # Delete the job posting file
        os.remove(job_file_path)
        
        return {"success": True, "message": "Job offer deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting job offer {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete job offer: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)