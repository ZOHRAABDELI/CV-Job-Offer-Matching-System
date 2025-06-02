import os
import json
import requests
import logging
from tika import parser
from typing import Dict, Optional
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Constants
QWEN_MODEL = "microsoft/phi-3.5-mini-128k-instruct"
OPENROUTER_API_KEY = "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" # put your API
OUTPUT_DIR = Path("../../Data/Processed/Resumes")

class ParseResume:
    def __init__(self, pdf_file_path: str):
        self.pdf_path = pdf_file_path
        self.pdf_name = os.path.basename(pdf_file_path)
        logger.info(f"Processing resume: {self.pdf_name}")
        
        # Ensure output directory exists
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        self.resume_data = self._extract_pdf_text()
        self.qwen_result = self._parse_with_qwen()
        
        # Save JSON to file
        self._save_json_output()

    def _extract_pdf_text(self) -> str:
        try:
            parsed = parser.from_file(self.pdf_path)
            content = parsed.get("content", "")
            
            # Log warning if document is very long
            #if content and len(content) > 300000:
            #    logger.warning(f"Very long document ({len(content)} chars), may exceed token limits")
                
            return content.strip() if content else ""
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            return ""

    def _format_prompt(self, text: str) -> str:
        return (
            "You are a resume parsing assistant.\n"
            "Extract the following sections from the resume:\n"
            "- Personal Information (Name, Email, Phone, Location)\n"
            "- Education (as Keywords)\n"
            "- Skills (as Keywords)\n"
            "- Work Experience (global Keywords related to work history)\n"
            "- Experience_Entries (list of entries with Field and duration in years)\n"
            "- Other Sections (any relevant information that doesn't fit in the above, as Keywords)\n\n"
            "Return the result strictly in valid, complete JSON format with no markdown formatting or extra commentary.\n"
            "{\n"
            "  \"Personal Information\": {\"Name\": \"\", \"Email\": \"\", \"Phone\": \"\", \"Location\": \"\"},\n"
            "  \"Education\": {\"Keywords\": [\"\", \"\"]},\n"
            "  \"Work Experience\": {\"Keywords\": [\"\", \"\"]},\n"
            "  \"Skills\": {\"Keywords\": [\"\", \"\"]},\n"
            "  \"Experience_Entries\": [\n"
            "    {\"Field\": [\"\", \"\"], \"duration_years\": 0.0},\n"
            "    {\"Field\": [\"\", \"\"], \"duration_years\": 0.0}\n"
            "  ],\n"
            "  \"Other Sections\": {\"Keywords\": [\"\", \"\"]}\n"
            "}\n\n"
            "For Personal Information, if no location is given, leave it blank. For location, include only the Wilaya (no city, country, or full addresses).\n"
            "In Education, list all degrees and topics as Keywords (e.g., \"Master in Data Science\", \"Baccalaureate in Mathematics\").\n"
            "In Work Experience, collect all skills and project-related terms as global keywords.\n"
            "For each Experience_Entry:\n"
            "- Extract all relevant keywords from the job title, company name, description, and related projects.\n"
            "- Add these keywords under the 'Field' array.\n"
            "- Calculate total experience duration in years for each entry.\n"
            "Project-related content should be integrated implicitly into the matching work experience if connected.\n"
            "IMPORTANT: NO MATTER THE LANGUAGE USED IN THE RESUME, YOU MUST ALWAYS PROVIDE THE EXTRACTION IN ENGLISH.\n\n"
            "Here is the resume text:\n"
            f"{text}"
        )
    def _parse_with_qwen(self) -> Dict:
        if not self.resume_data:
            logger.warning("No resume text extracted, skipping parsing")
            return {"error": "No resume text extracted"}

        prompt = self._format_prompt(self.resume_data)
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "Referer": "http://localhost"
        }

        payload = {
            "model": QWEN_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 15000  # Ensure we get complete responses
        }

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions", 
                headers=headers, 
                json=payload,
                timeout=600  # Increased timeout for longer documents
            )
            response.raise_for_status()
            result = response.json()

            # Safely access the message content
            choices = result.get("choices", [])
            if not choices:
                raise ValueError("No choices returned from model.")

            content = choices[0].get("message", {}).get("content", "")
            if not content:
                raise ValueError("No content found in model response.")

            # Better handling of markdown code blocks
            if "```" in content:
                # Extract just the JSON part from markdown code blocks
                code_blocks = content.split("```")
                for block in code_blocks:
                    block = block.strip()
                    if block.startswith("json"):
                        block = block[4:].strip()  # Remove "json" marker
                    if block and block.startswith("{") and block.endswith("}"):
                        content = block
                        break

            try:
                parsed_json = json.loads(content)
                return parsed_json
            except json.JSONDecodeError as jde:
                logger.error(f"JSON parsing error: {jde}")
                
                # More robust JSON repair
                try:
                    # Clean the content
                    content = content.strip()
                    # Handle truncated JSONs by checking for unbalanced brackets
                    if content.count('{') > content.count('}'):
                        missing_brackets = content.count('{') - content.count('}')
                        content += '}' * missing_brackets
                    
                    # Try again with the repaired JSON
                    return json.loads(content)
                except:
                    # If all attempts fail, save the raw output for debugging
                    return {"error": "Invalid JSON format in model response.", "raw_output": content}

        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {e}")
            return {"error": f"API request failed: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return {"error": str(e)}

    def _save_json_output(self):
        """Save the parsed resume data to a JSON file"""
        if not self.qwen_result:
            logger.warning(f"No valid JSON data to save for {self.pdf_name}")
            return
        
        # Create absolute path to ensure correct directory location
        output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../Data/Processed/Resumes"))
        
        # Ensure directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Create a filename based on the original PDF name
        base_name = os.path.splitext(self.pdf_name)[0]
        json_filename = f"{base_name}.json"
        json_path = os.path.join(output_dir, json_filename)
        
        try:
            # Print absolute path for debugging
            logger.info(f"Attempting to save to: {json_path}")
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(self.qwen_result, f, indent=2, ensure_ascii=False)
            
            # Verify file exists after saving
            if os.path.exists(json_path):
                logger.info(f"Successfully saved JSON data to {json_path}")
            else:
                logger.error(f"Failed to save: File does not exist after saving operation")
        except Exception as e:
            logger.error(f"Error saving JSON data: {e}")

    def get_JSON(self) -> dict:
        return self.qwen_result

