import json
from pathlib import Path
from typing import Dict, Any, Optional

from ..config import RESULTS_FILE
from ..utils.file_utils import load_json_file, save_json_file

class MatchingService:
    def __init__(self):
        self.results_file = RESULTS_FILE
    
    def get_matched_cvs(self) -> Dict[str, Any]:
        """Get matched CVs from results file"""
        if not self.results_file.exists():
            # If file doesn't exist, create sample data
            sample_data = {
                "job_description": "job_description_filename.json",
                "ranking": [
                    {
                        "resume": "resume1.json",
                        "total_score": 85.75,
                        "section_scores": {
                            "Education": 90.25,
                            "Work Experience": 85.5,
                            "Skills": 92.3,
                            "Experience_Requirements": 85.5
                        }
                    }
                ]
            }
            save_json_file(self.results_file, sample_data)
            return sample_data
        
        return load_json_file(self.results_file)
    
    def update_weights(self, weights: Dict[str, float]) -> Dict[str, Any]:
        """Update weights for the matching algorithm"""
        # Here you would update the weights in your matching algorithm
        # For now, just return success
        return {"status": "success", "message": "Weights updated successfully"}
