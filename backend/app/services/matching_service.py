import traceback
import httpx
from ..config import RESULTS_FILE
from ..utils.file_utils import save_json_file, load_json_file
from typing import Dict, Any
import datetime
import uuid
from ..config import DATA_DIR

class MatchingService:
    def __init__(self):
        self.results_file = RESULTS_FILE
        self.api_url = "http://127.0.0.1:8000"  # Make sure this is the correct URL
        self.cv_files_dir = DATA_DIR / "Resumes"

    
    async def get_matched_cvs(self) -> dict[str, Any]:
        """Get matched CVs by triggering /process-data and /rank-resumes."""
        timeout = httpx.Timeout(None)  # No timeout
        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                print("[DEBUG] Step 1: Sending request to /process-data...")
                process_response = await client.post(f"{self.api_url}/process-data/")
                print("[DEBUG] /process-data status code:", process_response.status_code)
                print("[DEBUG] /process-data response body:\n", process_response.text)
                
                if process_response.status_code != 200:
                    return {"success": False, "message": "Failed to process data."}
                
                print("[DEBUG] Step 2: Sending request to /rank-resumes...")
                rank_response = await client.get(f"{self.api_url}/rank-resumes/")
                print("[DEBUG] /rank-resumes status code:", rank_response.status_code)
                print("[DEBUG] /rank-resumes response body:\n", rank_response.text)

                if rank_response.status_code != 200:
                    return {"success": False, "message": "Failed to rank resumes."}
                
                # Debug parsing
                try:
                    ranking = rank_response.json()
                    print("[DEBUG] Parsed ranking JSON:", ranking)

                except Exception as parse_error:
                    print("[ERROR] Failed to parse /rank-resumes JSON!")
                    traceback.print_exc()
                    return {"success": False, "message": f"Error parsing JSON: {parse_error}"}

                # Prepare results structure
                results = {
                    "job_description": "job_description_filename.json",  # Replace if needed
                    "ranking": ranking
                }

                # flattening with debugging see in terminal 
                try:
                    if "ranking" in results and isinstance(results["ranking"], dict):
                        if "ranking" in results["ranking"]:
                            results["ranking"] = results["ranking"]["ranking"]
                            print("[DEBUG] Flattened ranking successfully")
                        else:
                            print("[DEBUG] No nested 'ranking' key found inside ranking result")
                    else:
                        print("[DEBUG] Skipped flattening — 'ranking' not a dict or missing")
                except Exception as flatten_error:
                    print("[ERROR] Failed while flattening ranking")
                    traceback.print_exc()

                # Save the results to the results file
                save_json_file(self.results_file, results)
                print("Results saved to:", self.results_file)

                # Return the results
                return results
            
            except httpx.RequestError as e:
                print("[ERROR] Request error occurred!")
                traceback.print_exc()
                return {"success": False, "message": f"Request error: {e}"}
            except Exception as general_error:
                print("[ERROR] Unexpected error occurred!")
                traceback.print_exc()
                return {"success": False, "message": f"Unexpected error: {general_error}"}
                
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

        # Load existing results or initialize
        if self.results_file.exists():
            results = load_json_file(self.results_file)
        else:
            results = {"job_description": "", "ranking": []}

        # Append a dummy ranking entry (or trigger a matching function)
        results["ranking"].append({
            "resume": filename,
            "total_score": 0.0,  # Placeholder, real scoring happens elsewhere
            "section_scores": {
                "Education": 0.0,
                "Work Experience": 0.0,
                "Skills": 0.0,
                "Experience_Requirements": 0.0
            },
            "addedAt": datetime.datetime.now().isoformat()
        })

        # Save updated results
        save_json_file(self.results_file, results)

        return {"status": "success", "filename": filename}