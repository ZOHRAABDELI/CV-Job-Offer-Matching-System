import traceback
import httpx

from ..models.job import JobPosting
from fastapi import APIRouter, HTTPException, Body, Depends, File, UploadFile

from ..config import RESULTS_FILE

from ..utils.file_utils import save_json_file, load_json_file, list_json_files
from typing import Dict, Any
import datetime
import uuid
from ..config import DATA_DIR
from datetime import datetime

class MatchingService:
    def __init__(self):
        self.results_file = RESULTS_FILE
        self.api_url = "http://127.0.0.1:8000"  # Make sure this is the correct URL
        self.cv_files_dir = DATA_DIR / "Resumes"
        self.weights = DATA_DIR / "Weights"


    async def get_matched_cvs(self) -> dict[str, Any]:
        """Get matched CVs by triggering /process-data and /rank-resumes."""
        # Return saved results
        return load_json_file(self.results_file)
        """timeout = httpx.Timeout(None)  # No timeout
        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                # Step 1: Trigger data processing
                print("[DEBUG] Step 1: Sending request to /process-data...")
                process_response = await client.post(f"{self.api_url}/process-data/")
                print("[DEBUG] /process-data status code:", process_response.status_code)
                print("[DEBUG] /process-data response body:\n", process_response.text)

                if process_response.status_code != 200:
                    return {"success": False, "message": "Failed to process data."}

                # Step 2: Load weights from file
                weights_data_list = list_json_files(self.weights)
                if not weights_data_list:
                    return {"success": False, "message": "No weights files found."}

                print("[DEBUG] All weight files loaded:", weights_data_list)
                latest_weights_data = max(
                    weights_data_list, key=lambda x: x.get("timestamp", 0)
                )

                weights_raw = latest_weights_data.get("weights", {})
                print("[DEBUG] Loaded weights from file:", weights_raw)
                print("[DEBUG] weights_raw types:", {k: type(v) for k, v in weights_raw.items()})

                # Convert all values to float
                weights_raw = {k: float(v) for k, v in weights_raw.items()}

                # Use lowercase keys to match your FastAPI parameter names
                raw_edu = weights_raw.get("education", 0)
                raw_exp = weights_raw.get("experience", 0)
                raw_skill = weights_raw.get("skills", 0)
                raw_mission = weights_raw.get("jobDescription", 0)  # Assuming this is correct

                total = raw_edu + raw_exp + raw_skill + raw_mission
                print("[DEBUG] Sum of weights:", total)

                if total == 0:
                    return {"success": False, "message": "Invalid weights in job offer."}

                # Normalize weights
                weights = {
                    "education": raw_edu / total,
                    "experience": raw_exp / total,
                    "skills": raw_skill / total,
                    "mission": raw_mission / total,
                }

                print("[DEBUG] Normalized weights to send:", weights)

                # Step 3: Rank resumes
                print("[DEBUG] Step 3: Sending request to /rank-resumes with weights...")
                rank_response = await client.get(f"{self.api_url}/rank-resumes/", params=weights)
                print("[DEBUG] /rank-resumes status code:", rank_response.status_code)
                print("[DEBUG] /rank-resumes response body:\n", rank_response.text)

                if rank_response.status_code != 200:
                    return {"success": False, "message": "Failed to rank resumes."}

                # Parse JSON response
                try:
                    ranking = rank_response.json()
                    print("[DEBUG] Parsed ranking JSON:", ranking)
                except Exception as parse_error:
                    print("[ERROR] Failed to parse /rank-resumes JSON!")
                    traceback.print_exc()
                    return {"success": False, "message": f"Error parsing JSON: {parse_error}"}

                # Prepare results structure
                results = {
                    "job_description": "job_description_filename.json",  # Placeholder, replace if needed
                    "ranking": ranking
                }

                # Flatten ranking if nested
                try:
                    if isinstance(results["ranking"], dict) and "ranking" in results["ranking"]:
                        results["ranking"] = results["ranking"]["ranking"]
                        print("[DEBUG] Flattened ranking successfully")
                    else:
                        print("[DEBUG] Skipped flattening — 'ranking' not a dict or missing")
                except Exception as flatten_error:
                    print("[ERROR] Failed while flattening ranking")
                    traceback.print_exc()

                # Save results
                save_json_file(self.results_file, results)
                print("Results saved to:", self.results_file)

            except httpx.RequestError as e:
                print("[ERROR] Request error occurred!")
                traceback.print_exc()
                return {"success": False, "message": f"Request error: {e}"}
            except Exception as general_error:
                print("[ERROR] Unexpected error occurred!")
                traceback.print_exc()
                return {"success": False, "message": f"Unexpected error: {general_error}"}

        # Return saved results
        return load_json_file(self.results_file)"""

                
    def update_weights(self, weights: Dict[str, float]) -> Dict[str, Any]:
        """Update weights for the matching algorithm"""
        # Here you would update the weights in your matching algorithm
        # For now, just return success
        return {"status": "success", "message": "Weights updated successfully"}
    

    def add_new_cv(self, cv_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new CV to the system and update results."""
        # Generate a unique filename
        cv_id = str(uuid.uuid4())
        filename = f"{cv_id}_{cv_data['filename']}"

        # Decode and save base64 content
        from ..utils.file_utils import save_base64_file
        save_base64_file(self.cv_files_dir, filename, cv_data["content"])


        return {"status": "success", "filename": filename}