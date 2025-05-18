from fastapi import APIRouter, HTTPException, Body, Depends, File, UploadFile
from typing import Dict, Any
from ..models.job import JobPosting
from ..services.job_service import JobService

router = APIRouter(prefix="/api/job-offers", tags=["job-offers"])

def get_job_service():
    return JobService()

@router.post("")
def create_job_offer(
    job_posting: JobPosting = Body(...),
    job_service: JobService = Depends(get_job_service)
):
    try:
        # This must finish ALL processing before returning
        result = job_service.create_job_offer(job_posting)
        # Optional: Add confirmation if CV matching was also done
        return {"success": True, "message": "Job offer created successfully", "data": result}

    except Exception as e:
        print(f"Error creating job offer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create job offer: {str(e)}")

@router.get("")
def get_job_offers(job_service: JobService = Depends(get_job_service)):
    try:
        return job_service.get_job_offers()
    except Exception as e:
        print(f"Error getting job offers: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve job offers: {str(e)}")

@router.get("/{job_id}")
def get_job_offer(job_id: str, job_service: JobService = Depends(get_job_service)):
    try:
        result = job_service.get_job_offer(job_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Job offer not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting job offer {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve job offer: {str(e)}")

@router.delete("/{job_id}")
def delete_job_offer(job_id: str, job_service: JobService = Depends(get_job_service)):
    try:
        result = job_service.delete_job_offer(job_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Job offer not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting job offer {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete job offer: {str(e)}")

