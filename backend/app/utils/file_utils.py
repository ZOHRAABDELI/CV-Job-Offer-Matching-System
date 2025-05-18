import json
import os
import base64
from pathlib import Path
from typing import Dict, Any, List
from fpdf import FPDF
from pathlib import Path

FONT_PATH = Path(__file__).resolve().parent.parent / "fonts" / "DejaVuSansCondensed.ttf"

def save_json_file(file_path: Path, data: Dict[str, Any]) -> None:
    """Save data as JSON to the specified file path"""
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)
def save_pdf_file(file_path: Path, data: Dict[str, Any]) -> None:
    """Save dictionary data as a PDF to the specified file path, with Unicode support"""
    pdf = FPDF()
    pdf.add_page()

    # Load a Unicode font (make sure the path is correct)
    pdf.add_font('DejaVu', '', str(FONT_PATH), uni=True)

    pdf.set_font('DejaVu', '', 12)

    def add_line(key: str, value: Any):
        # Turn lists and dicts into strings, format cleanly
        if isinstance(value, (list, dict)):
            value = json.dumps(value, indent=2, ensure_ascii=False)
        pdf.multi_cell(0, 10, f"{key}: {value}")
        pdf.ln(1)

    for key, value in data.items():
        add_line(key, value)

    # Ensure the output path has .pdf extension
    if file_path.suffix != ".pdf":
        file_path = file_path.with_suffix(".pdf")

    pdf.output(str(file_path))

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
