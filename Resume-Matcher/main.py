from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from services import transform_to_json
from services import rank_resumes
from typing import Optional
import os

app = FastAPI()

# Route to upload resumes
@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    # Save the uploaded resume
    file_path = f"Data/Resumes/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename}

# Route to upload job descriptions
@app.post("/upload-job-description/")
async def upload_job_description(file: UploadFile = File(...)):
    # Save the uploaded job description
    file_path = f"Data/JobDescription/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename}

# Route to clean all uploaded and processed files
@app.delete("/clean_data/")
async def clean_data():
    try:
        # Directories to clean
        directories = [
            "Data/JobDescription", "Data/Resumes",
            "Data/Processed/JobDescription", "Data/Processed/Resumes"
        ]
        
        for directory in directories:
            if os.path.exists(directory):
                # Remove all files inside the directory
                for file in os.listdir(directory):
                    file_path = os.path.join(directory, file)
                    if os.path.isfile(file_path):
                        os.remove(file_path)

        return {"message": "All uploaded and processed files have been deleted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cleaning data: {str(e)}")

# Route to rank resumes based on the uploaded job description

@app.get("/rank-resumes/")
async def rank(
    education: Optional[float] = Query(default=0.25, ge=0.0, le=1.0),
    experience: Optional[float] = Query(default=0.35, ge=0.0, le=1.0),
    skills: Optional[float] = Query(default=0.35, ge=0.0, le=1.0),
    mission: Optional[float] = Query(default=0.25, ge=0.0, le=1.0),


):

                      
    try:
        weights = {
            "Education": education,
            "Experience_Entries": experience,
            "Skills": skills,
            "Mission": mission
            
        }

        # Optional: Normalize weights if necessary
        total = sum(weights.values())
        if total != 1.0:
            weights = {k: v / total for k, v in weights.items()}

        ranking = rank_resumes(weights=weights)
        return JSONResponse(content=ranking)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to process resumes and job descriptions into JSON format
@app.post("/process-data/")
async def process_data():
    try:
        transform_to_json()  # Convert uploaded files to processed JSON format
        return {"message": "Resumes and job descriptions processed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")
    
# Route to get all resumes from the database
@app.get("/resumes/")
async def get_resumes():
    # Retrieve all resumes from the database
    pass  # Implementation goes here

# Route to get all job descriptions from the database
@app.get("/job-descriptions/")
async def get_job_descriptions():
    # Retrieve all job descriptions from the database
    pass  # Implementation goes here

# Route to create a new resume in the database
@app.post("/resumes/")
async def create_resume():
    # Create a new resume entry in the database
    pass  # Implementation goes here

# Route to create a new job description in the database
@app.post("/job-descriptions/")
async def create_job_description():
    # Create a new job description entry in the database
    pass  # Implementation goes here

# Route to delete a resume from the database
@app.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: int):
    # Delete a resume entry from the database
    pass  # Implementation goes here

# Route to delete a job description from the database
@app.delete("/job-descriptions/{job_description_id}")
async def delete_job_description(job_description_id: int):
    # Delete a job description entry from the database
    pass  # Implementation goes here
