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
            "Education": 0.30,
            "Skills": 0.40,
            "Experience": 0.30
        }

    total_score = 0.0
    section_scores = {}

    # Handle Education section with the same approach as Skills
    if "Education" in weights:
        resume_education = resume_data.get("Education", {}).get("Keywords", [])
        jd_education = jd_data.get("Job Description", {}).get("Education", {}).get("Keywords", [])
        
        if resume_education and jd_education:
            total_similarity_education = 0.0
            
            # For each education requirement in JD, find the most similar one in resume
            for jd_edu in jd_education:
                best_edu_match = 0.0
                
                for resume_edu in resume_education:
                    # Get similarity score between this JD education and resume education
                    similarity_result = get_score(jd_edu, resume_edu)
                    similarity_score = similarity_result[0].score * 100  # Convert to percentage
                    
                    # Keep track of the best match for this JD education requirement
                    if similarity_score > best_edu_match:
                        best_edu_match = similarity_score
                
                # Add the best match score for this JD education to the total
                total_similarity_education += best_edu_match
            
            # Calculate average education score by dividing by number of JD education requirements
            avg_education_score = total_similarity_education / len(jd_education)
            section_scores["Education"] = round(avg_education_score, 2)
            total_score += avg_education_score * weights["Education"]
        else:
            section_scores["Education"] = 0.0

    # Handle Skills section with the improved matching logic
    if "Skills" in weights:
        resume_skills = resume_data.get("Skills", {}).get("Keywords", [])
        jd_skills = jd_data.get("Job Description", {}).get("Skills", {}).get("Keywords", [])
        
        if resume_skills and jd_skills:
            total_similarity_skills = 0.0
            
            # For each skill in JD, find the most similar skill in resume
            for jd_skill in jd_skills:
                best_skill_match = 0.0
                
                for resume_skill in resume_skills:
                    # Get similarity score between this JD skill and resume skill
                    similarity_result = get_score(jd_skill, resume_skill)
                    similarity_score = similarity_result[0].score * 100  # Convert to percentage
                    
                    # Keep track of the best match for this JD skill
                    if similarity_score > best_skill_match:
                        best_skill_match = similarity_score
                
                # Add the best match score for this JD skill to the total
                total_similarity_skills += best_skill_match
            
            # Calculate average skill score by dividing by number of JD skills
            avg_skill_score = total_similarity_skills / len(jd_skills)
            section_scores["Skills"] = round(avg_skill_score, 2)
            total_score += avg_skill_score * weights["Skills"]
        else:
            section_scores["Skills"] = 0.0

    # Handle Work Experience section (same approach as Skills)
    resume_work_exp = resume_data.get("Work Experience", {}).get("Keywords", [])
    jd_work_exp = jd_data.get("Job Description", {}).get("Work Experience", {}).get("Keywords", [])
    
    if resume_work_exp and jd_work_exp:
        total_similarity_work_exp = 0.0
        
        # For each work experience keyword in JD, find the most similar one in resume
        for jd_exp in jd_work_exp:
            best_work_exp_match = 0.0
            
            for resume_exp in resume_work_exp:
                # Get similarity score between this JD work experience and resume work experience
                similarity_result = get_score(jd_exp, resume_exp)
                similarity_score = similarity_result[0].score * 100  # Convert to percentage
                
                # Keep track of the best match for this JD work experience
                if similarity_score > best_work_exp_match:
                    best_work_exp_match = similarity_score
            
            # Add the best match score for this JD work experience to the total
            total_similarity_work_exp += best_work_exp_match
        
        # Calculate average work experience score by dividing by number of JD work experience keywords
        avg_work_exp_score = total_similarity_work_exp / len(jd_work_exp)
        section_scores["Work Experience"] = round(avg_work_exp_score, 2)
    else:
        section_scores["Work Experience"] = 0.0

    # Handle Experience Entries
    experience_entries = jd_data.get("Job Description", {}).get("Experience_Entries", [])
    resume_experiences = resume_data.get("Experience_Entries", [])
    
    if experience_entries and resume_experiences:
        accepted_exp_scores = []
        
        for req in experience_entries:
            req_field = req.get("Field", [])
            # Convert field list to string for matching
            if isinstance(req_field, list):
                req_field = " ".join(req_field)
            req_min_years = req.get("duration_years", 0)
            best_match_score = 0
            requirement_matched = False
            
            # Find the most semantically similar experience entry that meets years requirement
            for exp in resume_experiences:
                exp_field = exp.get("Field", [])
                # Convert field list to string for matching
                if isinstance(exp_field, list):
                    exp_field = " ".join(exp_field)
                exp_duration = exp.get("duration_years", 0)
                
                # Check semantic similarity
                similarity_result = get_score(exp_field, req_field)
                similarity_score = similarity_result[0].score * 100  # Convert to percentage
                
                # Check if experience years >= required years, score > threshold, and it's the best match so far
                if exp_duration >= req_min_years and similarity_score > best_match_score and similarity_score >= similarity_threshold:
                    best_match_score = similarity_score
                    requirement_matched = True
            
            # Add score only if a matching experience was found
            if requirement_matched:
                accepted_exp_scores.append(best_match_score)
        
        # Calculate the average score of all accepted experiences
        if accepted_exp_scores:
            avg_exp_entry_score = sum(accepted_exp_scores) / len(accepted_exp_scores)
            section_scores["Experience_Entries"] = round(avg_exp_entry_score, 2)
        else:
            section_scores["Experience_Entries"] = 0.0
    else:
        section_scores["Experience_Entries"] = 0.0
    
    # Calculate combined Experience score (average of Work Experience and Experience_Entries)
    if "Experience" in weights:
            experience_score = (section_scores["Work Experience"] + section_scores["Experience_Entries"]) / 2
            section_scores["Work Experience"] = round(experience_score, 2)
            section_scores.pop("Experience_Entries", None)
            total_score += experience_score * weights["Experience"]

    if "Mission" in weights:
        jd_mission = jd_data.get("Job Description", {}).get("Mission", {}).get("Keywords", [])

        # resume work experience
        resume_experiences = resume_data.get("Work Experience", {}).get("Keywords", [])
        # resume skills
        resume_skills = resume_data.get("Skills", {}).get("Keywords", [])
        # resume work entries keywords 
        experience_fields = []
        for entry in resume_data.get("Experience_entries", []):
            if isinstance(entry, dict) and "Field" in entry:
                experience_fields.extend(entry["Field"])

        # combine all resume keywords 
        cv_keywords = list(set(resume_experiences + resume_skills + experience_fields))
        
        for jd_mis in jd_mission:
            best_mis_match = 0.0
            
            for cv_mis in cv_keywords:
                # Get similarity score between this JD mission and CV mission
                similarity_result = get_score(jd_mis, cv_mis)
                similarity_score = similarity_result[0].score * 100
                # Keep track of the best match for this JD mission
                if similarity_score > best_mis_match:
                    best_mis_match = similarity_score
            # Add the best match score for this JD mission to the total
            total_similarity_mission += best_mis_match
        # Calculate average mission score by dividing by number of JD missions
        avg_mission_score = total_similarity_mission / len(jd_mission)
        section_scores["Mission"] = round(avg_mission_score, 2)
        total_score += avg_mission_score * weights["Mission"]
    else:
        section_scores["Mission"] = 0.0

    cleaned_section_scores = {k: v for k, v in section_scores.items() if k != "Experience_Entries"}
    return round(total_score, 2), cleaned_section_scores




# def match_section(job_keywords, cv_keywords, model):
#     """Match each job keyword to the most similar CV keyword, then average the similarities."""
#     # Clean keywords
#     job_keywords = [clean_text(k) for k in job_keywords]
#     cv_keywords = [clean_text(k) for k in cv_keywords]

#     if not job_keywords:
#         return 1.0  # no required keywords => consider match complete
#     if not cv_keywords:
#         return 0.0  # no CV keywords => no match

#     # Embed all keywords
#     job_embeddings = model.encode(job_keywords)
#     cv_embeddings = model.encode(cv_keywords)

#     max_similarities = []

#     for job_emb in job_embeddings:
#         # Compute similarities between one job keyword and all CV keywords
#         sims = cosine_similarity([job_emb], cv_embeddings)[0]
#         max_sim = np.max(sims)  # take the best match
#         max_similarities.append(max_sim)

#     # Average of the best similarities
#     average_similarity = np.mean(max_similarities)
#     return float(average_similarity)

# def match_experience(job_keywords, cv_keywords, model):
#   experience_scores = []

#   for job_entry in job_keywords:
#     job_fields = job_entry.get("Field", [])
#     job_duration = job_entry.get("duration_years", 0)

#     best_score = 0.0  # Keep the best matching score for this job entry

#     for cv_entry in cv_keywords:
#       cv_fields = cv_entry.get("Field", [])
#       cv_duration = cv_entry.get("duration_years", 0)
#       if cv_fields:
#         score = match_section(job_fields, cv_fields, model)
#         if job_duration > 0:
#           scale = cv_duration / job_duration
#           # to be discussed 
#           if scale > 1:
#             scale = 1
#           score = score*scale

#       if score > best_score:
#         best_score = score

#     experience_scores.append(best_score)

#             # Final experience match score = average across all job experience entries
#   if experience_scores:
#     return sum(experience_scores) / len(experience_scores)
#   else:
#     return 0.0  # No experience entries in CV

# def get_matching_score(model, resume_path, jd_path, weights=None, similarity_threshold=60.0):
#     """
#     Computes the similarity score between a resume and a job description based on section-wise keywords
#     and experience entries.
    
#     Args:
#         resume_path (str): Path to the processed resume JSON file.
#         jd_path (str): Path to the processed job description JSON file.
#         weights (dict, optional): Weights for each section. Defaults to equal weights.
#             Example:
#                 {
#                     "Education": 0.25,
#                     "Skills": 0.25,
#                     "Experience": 0.25,
#                     "Mission":0.25
#                 }
#         similarity_threshold (float, optional): Minimum similarity score (percentage) required for 
#                                               an experience match to be considered valid. Defaults to 60.0.
    
#     Returns:
#         tuple: (weighted total score, dict of section scores)
#     """
#     # Read the JSON data
#     resume_data = read_json(resume_path)
#     jd_data = read_json(jd_path)
    
#     # Default weights if not provided
#     if weights is None:
#         weights = {
#             "Education": 0.25,
#             "Skills": 0.25,
#             "Experience": 0.25,
#             "Mission":0.25
#         }

#     total_score = 0.0
#     section_scores = {}

#     if "Education" in weights:
#         resume_education = resume_data.get("Education", {}).get("Keywords", [])
#         jd_education = jd_data.get("Job Description", {}).get("Education", {}).get("Keywords", [])
        
#         score = match_section(jd_education, resume_education, model)

#         section_scores["Education"] = round(score, 2)
#         total_score += score * weights["Education"]
#     else:
#         section_scores["Education"] = 0.0

#     if "Skills" in weights:
#         resume_skills = resume_data.get("Skills", {}).get("Keywords", [])
#         jd_skills = jd_data.get("Job Description", {}).get("Skills", {}).get("Keywords", [])
        
#         score = match_section(jd_skills, resume_skills, model)

#         section_scores["Skills"] = round(score, 2)
#         total_score += score * weights["Skills"]
#     else:
#         section_scores["Skills"] = 0.0


#     if "Experience" in weights:
#       experience_entries = jd_data.get("Job Description", {}).get("Work Experience", {}).get("Keywords", [])
#       resume_experiences = resume_data.get("Work Experience", {}).get("Keywords", [])

#       score_experience = match_section(experience_entries, resume_experiences, model)

#       experience_entries = jd_data.get("Job Description", {}).get("Experience_Entries", [])
#       resume_experiences = resume_data.get("Experience_Entries", [])

#       score_experience_entries = match_experience(experience_entries, resume_experiences, model)

#       score = (score_experience + score_experience_entries) / 2

#       section_scores["Experience"] = round(score, 2)
#       total_score += score * weights["Experience"]
#     else:
#       section_scores["Experience"] = 0.0
    
#     if "Mission" in weights:
#       jd_mission = jd_data.get("Job Description", {}).get("Mission", {}).get("Keywords", [])

#       # resume work experience
#       resume_experiences = resume_data.get("Work Experience", {}).get("Keywords", [])
#       # resume skills
#       resume_skills = resume_data.get("Skills", {}).get("Keywords", [])
#       # resume work entries keywords 
#       experience_fields = []
#       for entry in resume_data.get("Experience_entries", []):
#         if isinstance(entry, dict) and "Field" in entry:
#           experience_fields.extend(entry["Field"])

#       # combine all resume keywords 
#       cv_keywords = list(set(resume_experiences + resume_skills + experience_fields))
#       score = match_section(jd_mission, cv_keywords, model)
#       section_scores["Mission"] = round(score, 2)
#       total_score += score * weights["Mission"]
#     else:
#       section_scores["Mission"] = 0.0

#     cleaned_section_scores = {k: v for k, v in section_scores.items()}
#     return round(total_score, 2), cleaned_section_scores


def rank_resumes(model, weights=None):
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
        total_score, section_scores = get_matching_score(model, resume_path, jd_path, weights)
        scores.append((resume_file, total_score, section_scores))

    # Sort resumes by similarity score in descending order
    ranked_resumes = sorted(scores, key=lambda x: x[1], reverse=True)

    # Prepare the ranking results with section scores
    ranking_results = {
        "job_description": jd_filename,
        "ranking": [
            {
                "resume": resume_file,
                "total_score": total_score,
                "section_scores": section_scores
            } 
            for resume_file, total_score, section_scores in ranked_resumes
        ]
    }

    return ranking_results