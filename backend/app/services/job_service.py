import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

from ..models.job import JobPosting
from ..utils.file_utils import save_json_file, load_json_file, save_base64_file, list_json_files
from ..config import DATA_DIR
class JobService:
    def __init__(self):
        #self.job_postings_dir = DATA_DIR / "JobDescription" This is the correct path 
        self.job_postings_dir = DATA_DIR / "JobDesc"# For pdf test
        self.cv_files_dir = DATA_DIR / "Resumes"

    
    def create_job_offer(self, job_posting: JobPosting) -> Dict[str, Any]:
        """Create a new job offer and save associated CV files"""
        # Generate a unique ID for the job posting
        job_id = str(uuid.uuid4())
        
        # Save CV files if any
        cv_paths = []
        if job_posting.cvFiles:
            for cv_file in job_posting.cvFiles:
                # Create a unique filename
                filename = f"{job_id}_{cv_file.filename}"
                
                # Save the file
                saved_filename = save_base64_file(
                    self.cv_files_dir, 
                    filename, 
                    cv_file.content
                )
                
                cv_paths.append(saved_filename)
        
        # Prepare job posting data for saving
        job_data = job_posting.dict()
        job_data["id"] = job_id
        job_data["createdAt"] = datetime.now().isoformat()
        
        # Replace the CV file content with just the filenames
        job_data["cvFiles"] = cv_paths
        
        # Save the job posting as a JSON file
        job_file_path = self.job_postings_dir / f"{job_id}.json"
        save_json_file(job_file_path, job_data)
        
        return {"success": True, "jobId": job_id}
    
    def get_job_offers(self) -> Dict[str, Any]:
        """Get all job offers"""
        job_offers = list_json_files(self.job_postings_dir)
        
        # Process each job offer
        for job_data in job_offers:
            # Remove CV file paths for the list view
            if "cvFiles" in job_data:
                job_data["hasCVs"] = len(job_data["cvFiles"]) > 0
                del job_data["cvFiles"]
        
        # Sort by creation date (newest first)
        job_offers.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        
        return {"success": True, "jobOffers": job_offers}
    
    def get_job_offer(self, job_id: str) -> Dict[str, Any]:
        """Get a specific job offer by ID"""
        job_file_path = self.job_postings_dir / f"{job_id}.json"
        
        if not job_file_path.exists():
            return None
        
        job_data = load_json_file(job_file_path)
        return {"success": True, "jobOffer": job_data}
    
    def delete_job_offer(self, job_id: str) -> Dict[str, Any]:
        """Delete a job offer and its associated CV files"""
        job_file_path = self.job_postings_dir / f"{job_id}.json"
        
        if not job_file_path.exists():
            return None
        
        # Get the job data to find associated CV files
        job_data = load_json_file(job_file_path)
        
        # Delete associated CV files
        if "cvFiles" in job_data:
            for cv_filename in job_data["cvFiles"]:
                cv_path = self.cv_files_dir / cv_filename
                if cv_path.exists():
                    os.remove(cv_path)
        
        # Delete the job posting file
        os.remove(job_file_path)
        
        return {"success": True, "message": "Job offer deleted successfully"}

    