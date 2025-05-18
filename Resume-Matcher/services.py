import os
import json
import logging
from scripts.JobDescriptionProcessor import JobDescriptionProcessor
from scripts.ResumeProcessor import ResumeProcessor
from scripts.utils import get_filenames_from_dir, init_logging_config
from scripts.similarity.get_score import get_score

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
    
def get_matching_score(resume_path, jd_path, weights=None, similarity_threshold=60.0):
    """
    Computes the similarity score between a resume and a job description based on section-wise keywords
    and experience entries.
    
    Args:
        resume_path (str): Path to the processed resume JSON file.
        jd_path (str): Path to the processed job description JSON file.
        weights (dict, optional): Weights for each section. Defaults to equal weights.
            Example:
                {
                    "Education": 0.30,
                    "Skills": 0.40,
                    "Experience": 0.30
                }
        similarity_threshold (float, optional): Minimum similarity score (percentage) required for 
                                              an experience match to be considered valid. Defaults to 60.0.
    
    Returns:
        tuple: (weighted total score, dict of section scores)
    """
    # Read the JSON data
    resume_data = read_json(resume_path)
    jd_data = read_json(jd_path)
    
    # Default weights if not provided
    if weights is None:
        weights = {
            "Education": 0.25,
            "Skills": 0.25,
            "Experience": 0.25,
            "Mission":0.25
        }

    total_score = 0.0
    section_scores = {}

    # Handle Education section with the same approach as Skills
    if "Education" in weights:
        resume_education = " ".join(resume_data.get("Education", {}).get("Keywords", []))
        jd_education = " ".join(jd_data.get("Job Description", {}).get("Education", {}).get("Keywords", []))
        
        if resume_education and jd_education:
            similarity_score = get_score(jd_education, resume_education)[0].score * 100
            section_scores["Education"] = round(similarity_score, 2)
            total_score += similarity_score * weights["Education"]
        else:
            section_scores["Education"] = 0.0

    # Handle Skills section with the improved matching logic
    if "Skills" in weights:
        resume_skills = " ".join(resume_data.get("Skills", {}).get("Keywords", []))
        jd_skills = " ".join(jd_data.get("Job Description", {}).get("Skills", {}).get("Keywords", []))
        
        if resume_skills and jd_skills:
            similarity_score = get_score(jd_skills, resume_skills)[0].score * 100
            section_scores["Skills"] = round(similarity_score, 2)
            total_score += similarity_score * weights["Skills"]
        else:
            section_scores["Skills"] = 0.0

    # Work Experience (Keywords)
    resume_work_exp = " ".join(resume_data.get("Work Experience", {}).get("Keywords", []))
    jd_work_exp = " ".join(jd_data.get("Job Description", {}).get("Work Experience", {}).get("Keywords", []))
    if resume_work_exp and jd_work_exp:
        similarity_score = get_score(jd_work_exp, resume_work_exp)[0].score * 100
        section_scores["Work Experience"] = round(similarity_score, 2)
    else:
        section_scores["Work Experience"] = 0.0

    # Experience Entries 
    # I am not sure about this 
    experience_entries = jd_data.get("Job Description", {}).get("Experience_Entries", [])
    resume_experiences = resume_data.get("Experience_Entries", [])
    if experience_entries and resume_experiences:
        accepted_scores = []
        for req in experience_entries:
            req_field = " ".join(req.get("Field", [])) if isinstance(req.get("Field"), list) else req.get("Field", "")
            req_min_years = req.get("duration_years", 0)
            best_score = 0.0
            for exp in resume_experiences:
                exp_field = " ".join(exp.get("Field", [])) if isinstance(exp.get("Field"), list) else exp.get("Field", "")
                exp_duration = exp.get("duration_years", 0)
                score = get_score(req_field, exp_field)[0].score * 100
                if exp_duration >= req_min_years and score > best_score and score >= similarity_threshold:
                    best_score = score
            if best_score > 0:
                accepted_scores.append(best_score)
        section_scores["Experience_Entries"] = round(sum(accepted_scores) / len(accepted_scores), 2) if accepted_scores else 0.0
    else:
        section_scores["Experience_Entries"] = 0.0

    # Combine Work Experience and Experience Entries
    if "Experience" in weights:
        experience_score = (section_scores["Work Experience"] + section_scores["Experience_Entries"]) / 2
        section_scores["Work Experience"] = round(experience_score, 2)
        section_scores.pop("Experience_Entries", None)
        total_score += experience_score * weights["Experience"]

    # Mission
    if "Mission" in weights:
        jd_mission = " ".join(jd_data.get("Job Description", {}).get("Mission", {}).get("Keywords", []))

        resume_experiences = resume_data.get("Work Experience", {}).get("Keywords", [])
        resume_skills = resume_data.get("Skills", {}).get("Keywords", [])
        experience_fields = []
        for entry in resume_data.get("Experience_Entries", []):
            experience_fields.extend(entry.get("Field", []))
        all_cv_text = " ".join(set(resume_experiences + resume_skills + experience_fields))

        if jd_mission and all_cv_text:
            similarity_score = get_score(jd_mission, all_cv_text)[0].score * 100
            section_scores["Mission"] = round(similarity_score, 2)
            total_score += similarity_score * weights["Mission"]
        else:
            section_scores["Mission"] = 0.0

    cleaned_section_scores = {k: v for k, v in section_scores.items() if k != "Experience_Entries"}
    return round(total_score, 2), cleaned_section_scores


from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

def rank_resumes(weights=None):
    
    resumes_dir = "Data/Processed/Resumes"
    jds_dir = "Data/Processed/JobDescription"
    
    resume_files = get_filenames_from_dir(resumes_dir)
    jd_files = get_filenames_from_dir(jds_dir)

    if not resume_files or not jd_files:
        raise FileNotFoundError("No resumes or job descriptions found.")

    # Assume only ONE job description exists (pick the first one)
    jd_filename = jd_files[0]
    jd_path = os.path.join(jds_dir, jd_filename)
    
    resume_paths = [Path(os.path.join(resumes_dir, resume_file)) for resume_file in resume_files]

    def task(resume_path):
        score, section_scores = get_matching_score(resume_path, jd_path, weights)
        return {
            "resume_path": str(resume_path),
            "score": score,
            "section_scores": section_scores
        }

    with ProcessPoolExecutor() as executor: # here I can set ProcessPoolExecutor(max_workers=n) to limit the number of processes
        results = list(executor.map(task, resume_paths))

    # Sort results by descending score
    return sorted(results, key=lambda x: x["score"], reverse=True)
