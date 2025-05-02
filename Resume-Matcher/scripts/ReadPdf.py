import glob
import os
import re
from tika import parser  # Apache Tika for PDF parsing


def get_pdf_files(file_path: str) -> list:
    """
    Get a list of PDF files from the specified directory path.
    """
    try:
        return glob.glob(os.path.join(file_path, "*.pdf"))
    except Exception as e:
        print(f"Error getting PDF files from '{file_path}': {str(e)}")
        return []


def clean_extracted_text(text: str) -> str:
    """
    Clean and normalize text extracted from PDFs to fix formatting issues.
    """
    if not text:
        return ""

    # 1. Remove non-printable characters
    text = re.sub(r'[^\x20-\x7E\u00A0-\u00FF]', ' ', text)

    # 2. Merge artificially split characters (like P R O J E C T)
    text = re.sub(r'\b(?:[A-ZÀ-Ÿ])(?:\s+[A-ZÀ-Ÿ]){2,}\b',
                  lambda m: m.group().replace(' ', ''), text)

    # 3. Fix common joined French words (dun → d’un, lenvoi → l’envoi, etc.)
    text = re.sub(r"\bdun\b", "d’un", text, flags=re.IGNORECASE)
    text = re.sub(r"\blenvoi\b", "l’envoi", text, flags=re.IGNORECASE)
    text = re.sub(r"\betude\b", "étude", text, flags=re.IGNORECASE)
    text = re.sub(r"\bmise en oeuvre\b", "mise en œuvre", text, flags=re.IGNORECASE)
    text = re.sub(r"\b(?<=\w)(?=\s+\w)", lambda m: m.group().strip(), text)

    # 4. Remove multiple spaces and normalize
    text = re.sub(r'\s+', ' ', text)

    # 5. Reconstruct lines into clean paragraphs
    lines = text.splitlines()
    clean_lines = []
    for line in lines:
        if line.strip():
            clean_lines.append(line.strip())
    return ' '.join(clean_lines)


def read_single_pdf(file_path: str) -> str:
    """
    Read a single PDF file, extract and clean the text using Apache Tika.
    """
    try:
        parsed = parser.from_file(file_path)
        content = parsed.get("content", "")
        return clean_extracted_text(content.strip()) if content else ""
    except Exception as e:
        print(f"Error reading file '{file_path}': {str(e)}")
        return ""


def read_multiple_pdf(file_path: str) -> list:
    """
    Read multiple PDF files from the specified path and return cleaned text from each.
    """
    pdf_files = get_pdf_files(file_path)
    cleaned_texts = []

    for file in pdf_files:
        print(f"Processing: {file}")
        text = read_single_pdf(file)
        cleaned_texts.append({
            "file_name": os.path.basename(file),
            "clean_data": text
        })

    return cleaned_texts
