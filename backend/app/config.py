import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# Ensure data directories exist
os.makedirs(DATA_DIR / "job_postings", exist_ok=True)
os.makedirs(DATA_DIR / "cv_files", exist_ok=True)

# File paths
RESULTS_FILE = DATA_DIR / "results.json"

# API settings
API_HOST = "0.0.0.0"
API_PORT = 5000
CORS_ORIGINS = ["http://localhost:5173"]  # Vite's default port
