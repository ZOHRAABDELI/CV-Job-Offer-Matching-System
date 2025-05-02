from fastapi import APIRouter
from .job_offers import router as job_offers_router
from .matching import router as matching_router
from .auth import router as auth_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(job_offers_router)
router.include_router(matching_router)
