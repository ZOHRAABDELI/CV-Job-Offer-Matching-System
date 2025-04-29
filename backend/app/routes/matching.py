from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from ..models.matching import WeightsUpdate
from ..services.matching_service import MatchingService

router = APIRouter(tags=["matching"])

def get_matching_service():
    return MatchingService()

@router.get("/api/matched-cvs")
async def get_matched_cvs(matching_service: MatchingService = Depends(get_matching_service)):
    try:
        return matching_service.get_matched_cvs()
    except Exception as e:
        print(f"Error fetching matched CVs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/api/update-weights")
async def update_weights(
    weights: WeightsUpdate,
    matching_service: MatchingService = Depends(get_matching_service)
):
    try:
        # Validate weights sum to 1
        total = sum(weights.dict().values())
        if abs(total - 1.0) > 0.01:  # Allow small floating point error
            raise HTTPException(status_code=400, detail=f"Weights must sum to 1.0, got {total}")
        
        return matching_service.update_weights(weights.dict())
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating weights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update weights: {str(e)}")
