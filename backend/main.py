# main.py - FastAPI application setup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import engine, Base
import routes

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Perfect Match API")

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # React default port
    "http://localhost:5173",  # Vite default port
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.router)

# Root path
@app.get("/")
def read_root():
    return {"message": "Welcome to Perfect Match API"}

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)