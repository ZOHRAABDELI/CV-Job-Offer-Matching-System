
# Resume Matcher: CV Matching Platform for Mobilis HR

## Project Overview

Resume Matcher is a CV matching platform designed for Mobilis HR to streamline and automate the process of filtering through CVs. This system leverages advanced Natural Language Processing (NLP) models, including Qwen (`microsoft/phi-3.5-mini-128k-instruct`), to efficiently compare job descriptions (JDs) with resumes (CVs) and rank candidates based on suitability, skills, and experience.

---

### Purpose

The CV & JD Matching System aims to assist recruiters and hiring managers in automating the candidate selection process by leveraging NLP technologies. It enables recruiters to efficiently compare job descriptions (JDs) with resumes (CVs) and rank candidates based on suitability, skills, and experience.

---


### Product Functions

* **Recruiter Dashboard**: Provides a centralized view for recruiters to manage candidate rankings and upload CVs/JDs.
* **CV & JD Parsing**: Extracts key data points (skills, experience, education, etc.) from CVs and JDs using NLP.
* **AI-Powered Matching**: Calculates similarity scores between CVs and JDs using suitable AI techniques.
* **Candidate Ranking & Scoring**: Ranks candidates based on job fit and customizable weightings (predefined or user-defined).
* **Bias-Free Mode**: Allows for fair evaluation by hiding personal information from candidate profiles.

---

## Technologies Used

* **Frontend**: React / Tailwind CSS
* **Backend**: FastAPI (Python)
* **Database**: PostgreSQL
* **NLP Model**: Qwen (`Qwen/Qwen 2.5 7B Instruc`)
* **Other Tools**: Git

---

## Project Structure

```
.
├── backend
│   ├── app                    # FastAPI application logic
│   ├── data                   # (Potentially for temporary data storage)
│   ├── __pycache__
│   ├── requirements.txt       # Backend specific Python dependencies
│   └── run.py                 # Script to run the backend
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules           # Frontend dependencies
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   ├── README.md
│   ├── src                    # React application source code
│   └── vite.config.js
├── node_modules             
├── package.json
├── package-lock.json
├── README.md                 
├── requirements.txt           # Consolidated Python dependencies
└── Resume-Matcher             # Core Resume Matching Engine
    ├── alembic                # Database migration scripts
    ├── alembic.ini
    ├── app.log
    ├── Data                   # Processed data, including results.json
    ├── database.py            # Database connection and ORM setup
    ├── __init__.py
    ├── main.py                # Main entry point for the Resume Matching Engine
    ├── models.py              # Database models
    ├── __pycache__
    ├── schemas.py             # Pydantic schemas for data validation
    ├── scripts
    ├── services.py            # Business logic and service functions
    ├── test.py
    └── test_ui_st.py
```

---

## How it Works

When a job offer is created via the UI, it triggers the `getMatchedCVs()` function, which performs the following steps:

1.  **Calls the model via `/process-data/`**: Initiates the CV and JD processing by the Resume Matching Engine.
2.  **Ranks CVs based on matching**: The NLP model and associated logic analyze and rank the CVs against the provided job description.
3.  **Waits for results**: The system awaits the completion of the matching process.
4.  **Saves the results**: The matching results are saved to `Resume-Matcher/Data/results.json`.
5.  **Sends them back to the UI**: The processed and ranked results are then sent back to the UI for display in a results table.

---

## Setup and Run Instructions

### Prerequisites

* Node.js and npm (for the frontend)
* Python 3.9+ (recommended)
* PostgreSQL database
* An `OPENROUTER_API_KEY` for the Qwen model.

### 1. Environment Variables

Ensure your `OPENROUTER_API_KEY` is configured. For production environments, it's best practice to load this from environment variables rather than hardcoding it.

```python
QWEN_MODEL = "microsoft/phi-3.5-mini-128k-instruct"
OPENROUTER_API_KEY = "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" # Load securely in production
OUTPUT_DIR = Path("../../Data/Processed/Resumes")
```

### 2. Install Dependencies

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate # On Windows: .\venv\Scripts\activate

# Install all Python dependencies
pip install -r requirements.txt
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Start the FastAPI Backend (UI/API logic)

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### 5. Start the Resume Matching Engine (model + processing)

```bash
cd Resume-Matcher
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Folder Setup and Data Management

* **`Resume-Matcher/Data/`**: This directory stores CVs and results after new CVs are added and processed.
* **`jobDescription/`**: This temporary folder stores job offers after creation via the UI.
    * **Important**: For the model to function correctly, job offers should ideally be moved to `Resume-Matcher/Data/Job Description/`. You can adjust the route in the application to ensure this happens automatically, or manually move the files for testing.
* **Model Expectation**: The core matching model expects job offers to be located in `Resume-Matcher/Data/Job Description/`. A sample JD PDF is provided there for testing.



## Dependencies

The `requirements.txt` file lists all necessary Python dependencies, categorized for clarity.
