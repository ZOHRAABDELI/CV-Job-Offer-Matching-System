from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import router
from .config import CORS_ORIGINS

def create_app() -> FastAPI:
    app = FastAPI(title="CV Job Matching API")
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include all routes
    app.include_router(router)
    
    return app

app = create_app()
