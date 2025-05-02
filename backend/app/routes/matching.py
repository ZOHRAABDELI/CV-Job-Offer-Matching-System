from ..models.job import CVFile
from fastapi import APIRouter, HTTPException, Depends
from fastapi import APIRouter, HTTPException, Body, Depends, File, UploadFile

from typing import Dict, Any, List

from ..models.matching import WeightsUpdate
from ..services.matching_service import MatchingService

router = APIRouter(tags=["matching"])

def get_matching_service():
    return MatchingService()

@router.get("/api/matched-cvs")
async def get_matched_cvs(matching_service: MatchingService = Depends(get_matching_service)):
    try:
        print("[FASTAPI] /api/matched-cvs endpoint hit")
        # Await the asynchronous method
        return await matching_service.get_matched_cvs()
    except Exception as e:
        print(f"Error fetching matched CVs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/api/update-weights")
async def update_weights(
    weights: WeightsUpdate,
    matching_service: MatchingService = Depends(get_matching_service)
):
    try:
        print("Received weights:", weights)
        total = sum(weights.dict().values())
        print(f"Total sum of weights: {total}")

        if abs(total - 1.0) > 0.01:  # Allow small floating point error
            raise HTTPException(status_code=400, detail=f"Weights must sum to 1.0, got {total}")
        
        result = matching_service.update_weights(weights.dict())
        return result
    except HTTPException as e:
        print(f"HTTPException: {str(e)}")
        raise e  # Re-raise HTTPException to propagate error
    except Exception as e:
        print(f"Error updating weights: {str(e)}")
        # Log full stack trace to understand where the error is coming from
        import traceback
        print("Error traceback:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to update weights: {str(e)}")

@router.post("/api/upload-cvs")
async def upload_cvs(
    cv_files: List[CVFile] = Body(...),  # Explicitly declare as request body
    matching_service: MatchingService = Depends(MatchingService)
):
    try:
        results = []
        for cv_data in cv_files:
            result = matching_service.add_new_cv(cv_data.dict())
            results.append(result)
        return {"success": True, "uploaded_files": results}
    except Exception as e:
        print(f"Error uploading CVs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload CVs")