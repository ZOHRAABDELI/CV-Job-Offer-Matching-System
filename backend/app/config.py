from pathlib import Path
import os

# Navigate to the root (go up 1 level from backend)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "Resume-Matcher" / "Data"

# Ensure required directories exist
#os.makedirs(DATA_DIR / "JobDescription", exist_ok=True) This is the correct path 
os.makedirs(DATA_DIR / "JobDesc", exist_ok=True)# This one is to test with JD as pdf 

os.makedirs(DATA_DIR / "Resumes", exist_ok=True)

# Example path for results
RESULTS_FILE = DATA_DIR / "results.json"


# API settings
API_HOST = "0.0.0.0"
API_PORT = 5000
CORS_ORIGINS = ["http://localhost:5173"]  # Vite's default port
