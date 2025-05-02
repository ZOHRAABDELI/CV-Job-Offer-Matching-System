import streamlit as st
import pandas as pd
import requests
import json
import os

# Set page configuration
st.set_page_config(
    page_title="Resume Ranking System",
    layout="wide"
)

# Define API base URL
API_BASE_URL = "http://localhost:8000"  # Change this to match your FastAPI server address

# App title
st.title("Resume Ranking System")
st.markdown("---")

# Create tabs for the three main functionalities
tab1, tab2, tab3 = st.tabs(["Clean Data", "Parse JSON", "Ranking Results"])

# Tab 1: Clean Data
with tab1:
    st.header("Clean Data")
    st.write("Click the button below to clean all uploaded and processed files.")
    
    if st.button("Clean All Data", key="clean_data_button"):
        try:
            with st.spinner("Cleaning data..."):
                response = requests.delete(f"{API_BASE_URL}/clean_data/")
                
                if response.status_code == 200:
                    st.success("All uploaded and processed files have been deleted successfully!")
                else:
                    st.error(f"Error cleaning data: {response.text}")
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

# Tab 2: Parse JSON
with tab2:
    st.header("Parse JSON Data")
    st.write("This will process uploaded resumes and job descriptions to extract and structure their content.")
    
    # Note: The FastAPI code you provided doesn't have a specific endpoint for processing data,
    # but you mentioned we should include it, so I'm adding a placeholder button
    if st.button("Process All Files", key="process_data_button"):
        try:
            with st.spinner("Processing files..."):
                # You'll need to implement this endpoint in your FastAPI app
                response = requests.post(f"{API_BASE_URL}/process-data/")
                
                if response.status_code == 200:
                    st.success("All files processed successfully!")
                else:
                    st.error(f"Error processing files: {response.text}")
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

# Tab 3: Ranking Results
with tab3:
    st.header("Resume Rankings")
    
    # Section for weight customization
    with st.expander("Customize Ranking Weights", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            education = st.slider("Education Weight", 0.0, 1.0, 0.25, 0.01)
            experience = st.slider("Work Experience Weight", 0.0, 1.0, 0.35, 0.01)
        
        with col2:
            skills = st.slider("Skills Weight", 0.0, 1.0, 0.35, 0.01)
            certifications = st.slider("Certifications Weight", 0.0, 1.0, 0.05, 0.01)
    
    # Button to fetch ranking results
    if st.button("Get Rankings", key="get_rankings_button"):
        try:
            with st.spinner("Fetching ranking results..."):
                # Prepare parameters
                params = {
                    "education": education,
                    "experience": experience,
                    "skills": skills,
                    "certifications": certifications
                }
                
                # Make API request
                response = requests.get(f"{API_BASE_URL}/rank-resumes/", params=params)
                
                if response.status_code == 200:
                    ranking_data = response.json()
                    
                    # Display job description info
                    st.subheader("Job Description Used")
                    job_desc = ranking_data.get("job_description", "No job description found")
                    st.info(f"{os.path.basename(job_desc)}")
                    
                    # Create and display ranking table
                    st.subheader("Resume Rankings")
                    
                    # Extract ranking data for the table
                    resumes_data = []
                    
                    for resume in ranking_data.get("ranking", []):
                        resume_name = os.path.basename(resume.get("resume", ""))
                        total_score = resume.get("total_score", 0)
                        
                        section_scores = resume.get("section_scores", {})
                        education_score = section_scores.get("Education", 0)
                        work_exp_score = section_scores.get("Work Experience", 0)
                        skills_score = section_scores.get("Skills", 0)
                        cert_score = section_scores.get("Certifications", 0)
                        
                        resumes_data.append({
                            "Resume": resume_name,
                            "Total Score": total_score,
                            "Education": education_score,
                            "Work Experience": work_exp_score,
                            "Skills": skills_score,
                            "Certifications": cert_score
                        })
                    
                    # Convert to DataFrame for display
                    if resumes_data:
                        df = pd.DataFrame(resumes_data)
                        
                        # Format to 2 decimal places
                        for col in ["Total Score", "Education", "Work Experience", "Skills", "Certifications"]:
                            df[col] = df[col].apply(lambda x: f"{x:.2f}" if isinstance(x, (int, float)) else x)
                        
                        # Display the table
                        st.dataframe(df, use_container_width=True)
                    else:
                        st.warning("No ranking data available.")
                else:
                    st.error(f"Error fetching rankings: {response.text}")
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

# Footer
st.markdown("---")
st.caption("Resume Ranking System © 2025")