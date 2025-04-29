import os
import json
import logging
from scripts import JobDescriptionProcessor, ResumeProcessor
from scripts.utils import get_filenames_from_dir, init_logging_config
import nltk
from scripts.similarity.get_score import get_score


try:
    nltk.data.find("tokenizers/punkt_tab")
except LookupError:
    nltk.download("punkt_tab")
# Initialize logging configuration
init_logging_config()

# Define paths for processed data
script_dir = os.path.dirname(os.path.abspath(__file__))
PROCESSED_DATA_PATH = os.path.join(script_dir, "Data", "Processed")
PROCESSED_RESUMES_PATH = os.path.join(PROCESSED_DATA_PATH, "Resumes")
PROCESSED_JOB_DESCRIPTIONS_PATH = os.path.join(PROCESSED_DATA_PATH, "JobDescription")

# Ensure necessary directories exist
os.makedirs(PROCESSED_DATA_PATH, exist_ok=True)
os.makedirs(PROCESSED_RESUMES_PATH, exist_ok=True)
os.makedirs(PROCESSED_JOB_DESCRIPTIONS_PATH, exist_ok=True)

def process_resumes():
    logging.info("Started processing resumes.")
    file_names = get_filenames_from_dir("Data/Resumes")
    
    if not file_names:
        logging.warning("No resumes found in Data/Resumes.")
        return

    # Parse each resume file
    for file in file_names:
        logging.info(f"Processing resume: {file}")
        processor = ResumeProcessor(file)
        processor.process()  # Ensure this method saves the output in JSON format

    logging.info("Finished processing resumes.")

def process_job_descriptions():
    logging.info("Started processing job descriptions.")
    file_names = get_filenames_from_dir("Data/JobDescription")

    if not file_names:
        logging.warning("No job descriptions found in Data/JobDescription.")
        return

    # Parse each job description file
    for file in file_names:
        logging.info(f"Processing job description: {file}")
        processor = JobDescriptionProcessor(file)
        processor.process()  # Ensure this method saves the output in JSON format

    logging.info("Finished processing job descriptions.")

def transform_to_json():
    # Process resumes and job descriptions
    process_resumes()
    process_job_descriptions()
    logging.info("Successfully processed all resumes and job descriptions.")




def read_json(filename):
    """Reads a JSON file and returns its content as a dictionary."""
    with open(filename) as f:
        return json.load(f)

def get_matching_score(resume_path, jd_path):
    """
    Computes the similarity score between a resume and a job description.
    
    Args:
        resume_path (str): Path to the processed resume JSON file.
        jd_path (str): Path to the processed job description JSON file.
    
    Returns:
        float: Similarity score between resume and job description (0-100).
    """
    resume_data = read_json(resume_path)
    jd_data = read_json(jd_path)
    
    resume_string = " ".join(resume_data["extracted_keywords"])
    jd_string = " ".join(jd_data["extracted_keywords"])
    
    result = get_score(resume_string, jd_string)
    return round(result[0].score * 100, 2)

def rank_resumes():
    """Ranks resumes based on their similarity to the first job description."""
    resumes_dir = "Data/Processed/Resumes"
    jds_dir = "Data/Processed/JobDescription"
    
    resume_files = get_filenames_from_dir(resumes_dir)
    jd_files = get_filenames_from_dir(jds_dir)

    if not resume_files or not jd_files:
        raise FileNotFoundError("No resumes or job descriptions found.")

    # Assume only ONE job description exists (pick the first one)
    jd_filename = jd_files[0]
    jd_path = os.path.join(jds_dir, jd_filename)

    scores = []
    
    for resume_file in resume_files:
        resume_path = os.path.join(resumes_dir, resume_file)
        score = get_matching_score(resume_path, jd_path)
        scores.append((resume_file, score))

    # Sort resumes by similarity score in descending order
    ranked_resumes = sorted(scores, key=lambda x: x[1], reverse=True)

    # Prepare the ranking results
    ranking_results = {
        "job_description": jd_filename,
        "ranking": [{"resume": resume_file, "score": score} for resume_file, score in ranked_resumes]
    }

    return ranking_results