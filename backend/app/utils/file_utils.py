import json
import os
import base64
from pathlib import Path
from typing import Dict, Any, List

def save_json_file(file_path: Path, data: Dict[str, Any]) -> None:
    """Save data as JSON to the specified file path"""
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

def load_json_file(file_path: Path) -> Dict[str, Any]:
    """Load JSON data from the specified file path"""
    with open(file_path, "r") as f:
        return json.load(f)

def save_base64_file(directory: Path, filename: str, base64_content: str) -> str:
    """
    Save a base64 encoded file to disk
    Returns the saved filename
    """
    file_content = base64.b64decode(base64_content)
    file_path = directory / filename
    
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    return filename

def list_json_files(directory: Path) -> List[Dict[str, Any]]:
    """List all JSON files in a directory and return their contents"""
    result = []
    
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = directory / filename
            with open(file_path, "r") as f:
                result.append(json.load(f))
    
    return result
