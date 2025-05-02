# Resume Matcher

---

## **Installation and Setup**
### **1. Clone the Repository**
```bash
git clone <repository_url>
cd Resume-Matcher
```

### **2. Create a Virtual Environment**
```bash
python -m venv env
source env/bin/activate  # On macOS/Linux
env\Scripts\activate  # On Windows
```

### **3. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **4. Run the FastAPI Server**
```bash
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.
Check `http://127.0.0.1:8000/docs`.

---

## **Project Structure**
```
resume-matcher/
│── Data/
│   ├── JobDescription/         # Uploaded job descriptions
│   ├── Resumes/                # Uploaded resumes
│   ├── Processed/
│       ├── JobDescription/      # Processed job descriptions in JSON format
│       ├── Resumes/             # Processed resumes in JSON format
│── scripts/                     # Utility scripts
│── app.log                       # Log file
│── database.py                    # Database setup (if needed)
│── main.py                        # FastAPI application entry point
│── models.py                      # Data models
│── schemas.py                     # Pydantic schemas
│── services.py                     # Core processing functions
│── requirements.txt                # Dependencies
│── README.md                      # Project documentation
│── .gitignore                      # Ignored files
```

---

## **API Usage**

### **1. Process Data (Extract & Convert to JSON)**
```http
POST /process-data/
```
**Response:**
```json
{
    "message": "Resumes and job descriptions processed successfully."
}
```

---

### **2. Rank Resumes**
```http
GET /rank-resumes/
```
**Response Example:**
```json
[
    {"resume": "resume1.pdf", "score": 85},
    {"resume": "resume2.pdf", "score": 72}
]
```

---

### **3. Clean All Uploaded and Processed Data**
```http
DELETE /clean_data/
```
**Response:**
```json
{
    "message": "All uploaded and processed files have been deleted successfully."
}
```



