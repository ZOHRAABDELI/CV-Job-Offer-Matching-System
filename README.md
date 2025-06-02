
# Resume Matcher

---

## Overview

Resume Matcher is a CV matching platform designed for Mobilis HR to streamline and automate the process of filtering through CVs. This system leverages advanced NLP models including **Qwen** and **BAAI’s bge-base-en**, combined with **Apache Tika** for document parsing, to extract meaningful insights and rank candidates efficiently.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd Resume-Matcher
````

### 2. Create a Virtual Environment

```bash
python -m venv env
source env/bin/activate  # macOS/Linux
env\Scripts\activate     # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the FastAPI Server

```bash
uvicorn main:app --reload
```

The API will be available at: `http://127.0.0.1:8000`
API documentation is available at: `http://127.0.0.1:8000/docs`

---

## Project Structure

```
resume-matcher/
│── Data/
│   ├── JobDescription/         # Uploaded job descriptions
│   ├── Resumes/                # Uploaded resumes
│   ├── Processed/
│       ├── JobDescription/      # Processed job descriptions in JSON format
│       ├── Resumes/             # Processed resumes in JSON format
│── scripts/                     # Utility scripts
│── app.log                     # Log file
│── database.py                 # Database setup (if applicable)
│── main.py                     # FastAPI application entry point
│── models.py                   # Data models definitions
│── schemas.py                  # Pydantic schemas for request/response
│── services.py                 # Core processing functions (NLP, ranking, etc.)
│── requirements.txt            # Python dependencies
│── README.md                   # Project documentation
│── .gitignore                  # Ignored files
```

---

## API Usage

### 1. Process Data (Extract & Convert to JSON)

```http
POST /process-data/
```

**Description:**
Uploads and processes resumes and job descriptions using Apache Tika for parsing and the Qwen & BAAI/bge-base-en models for NLP extraction.

**Response:**

```json
{
    "message": "Resumes and job descriptions processed successfully."
}
```

---

### 2. Rank Resumes

```http
GET /rank-resumes/
```

**Description:**
Ranks uploaded resumes against the job descriptions based on matching scores derived from embedding comparisons.

**Response Example:**

```json
[
    {"resume": "resume1.pdf", "score": 85},
    {"resume": "resume2.pdf", "score": 72}
]
```

---

### 3. Clean All Uploaded and Processed Data

```http
DELETE /clean_data/
```

**Description:**
Deletes all uploaded resumes, job descriptions, and processed JSON data to reset the system.

**Response:**

```json
{
    "message": "All uploaded and processed files have been deleted successfully."
}
```

---


