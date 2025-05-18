import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

from ..models.job import JobPosting
from ..utils.file_utils import save_pdf_file, load_json_file, save_base64_file, list_json_files, save_json_file
from ..config import DATA_DIR
class JobService:
    def __init__(self):
        self.job_postings_dir = DATA_DIR / "JobDescription"  
        #self.job_postings_dir = DATA_DIR / "JobDesc"# For pdf test
        self.cv_files_dir = DATA_DIR / "Resumes"
        self.weights = DATA_DIR / "Weights"


    
    def create_job_offer(self, job_posting: JobPosting) -> Dict[str, Any]:
        """Create a new job offer and save associated CV files"""
        job_id = str(uuid.uuid4())

        # Save CV files if any
        cv_paths = []
        if job_posting.cvFiles:
                    for cv_file in job_posting.cvFiles:
                        # Generate a unique filename based on content hash to avoid duplicates
                        # This assumes the filename has an extension
                        name_parts = cv_file.filename.split('.')
                        base_name = '.'.join(name_parts[:-1]) if len(name_parts) > 1 else name_parts[0]
                        extension = name_parts[-1] if len(name_parts) > 1 else ""
                        
                        # Create a unique filename based on the original name
                        unique_filename = f"{base_name}_{uuid.uuid4().hex[:8]}.{extension}"
                        
                        # Check if this exact file content already exists
                        saved_filename = save_base64_file(
                            self.cv_files_dir,
                            unique_filename,
                            cv_file.content
                        )
                        cv_paths.append(saved_filename)

        # Prepare job posting data for saving
        job_data = job_posting.dict()
        job_data["id"] = job_id
        job_data["createdAt"] = datetime.now().isoformat()
        job_data["cvFiles"] = cv_paths

        # Save job posting as JSON
        job_file_path = self.job_postings_dir / f"{job_id}.json"
        save_pdf_file(job_file_path, job_data)

        # Save weights JSON (if provided in the job_posting)
        if "weights" in job_data:
            weights_data = {
                "jobId": job_id,
                "weights": job_data["weights"],
                "timestamp": datetime.now().timestamp()
            }
            weights_file_path = self.weights / f"{job_id}_weights.json"
            save_json_file(weights_file_path, weights_data)

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

    