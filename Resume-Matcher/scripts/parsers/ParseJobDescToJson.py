import os
import json
import requests
import logging
from tika import parser
from typing import Dict
from pathlib import Path

# Constants
OUTPUT_DIR = Path("../../Data/Processed/JobDescription")
QWEN_MODEL = "qwen/qwen-2.5-7b-instruct"
OPENROUTER_API_KEY = "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"

# Logger
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

class ParseJobDescription:
    def __init__(self, jd_file_path: str):
        self.jd_path = jd_file_path
        self.jd_name = os.path.basename(jd_file_path)
        logger.info(f"Processing job description: {self.jd_name}")

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        self.jd_text = self._extract_text()
        self.qwen_result = self._parse_with_qwen()
        self._save_json_output()

    def _extract_text(self) -> str:
        try:
            parsed = parser.from_file(self.jd_path)
            content = parsed.get("content", "")
            if content and len(content) > 300000:
                logger.warning(f"Very long job description ({len(content)} chars), may exceed token limits")
            return content.strip() if content else ""
        except Exception as e:
            logger.error(f"Error extracting JD text: {e}")
            return ""

    def _format_prompt(self, text: str) -> str:
        return (
            "You are a job description parsing assistant.\n"
            "Extract the following sections from the job description:\n"
            "- Education\n"
            "- Mission \n"
            "- Work Experience\n"
            "- Skills\n\n"
            "Return the result strictly in valid, complete JSON format with no markdown formatting or additional text.\n"
            "{\n"
            "  \"Job Description\": {\n"
            "    \"Education\": {\n"
            "      \"Keywords\": [\"\", \"\"]\n"
            "    },\n"
            "    \"Work Experience\": {\n"
            "      \"Keywords\": [\"\", \"\"]\n"
            "    },\n"            
            "    \"Experience_Entries\": [\n"
            "      {\n"
            "        \"Field\": [\"\", \"\"],\n"
            "        \"duration_years\": 1.0\n"
            "      },\n"
            "      {\n"
            "        \"Field\": [\"\", \"\"],\n"
            "        \"duration_years\": 1.0\n"
            "      }\n"
            "    ],\n"
            "    \"Skills\": {\n"
            "      \"Keywords\": [\"\", \"\"]\n"
            "    },\n"
            "    \"Mission\": {\n"
            "      \"Keywords\": [\"\", \"\"]\n"
            "    }\n"
            "  }\n"
            "}\n\n"
            "Extract each distinct experience entry as a separate item in Experience_Entries, as many as needed. For each entry, identify the field domains as a list of keywords and the duration in years. IMPORTANT: NOTE THAT NO MATTER THE LANGUAGE USED FOR THE JOB DESCRIPTION, YOU MUST ALWAYS PROVIDE THE EXTRACTION USING ENGLISH (WHATEVER THE LANGUAGE ALWAYS TRANSLATE TO ENGLISH). For the Education section, extract educational requirements as keywords. For Mission and Skills sections, extract relevant keywords, even if there isn't an explicit mention of any of the sections requied, and you find out that there are keywords in the job description that belong to that section, you should put them in that relevant section as a keyword .\n\n"
            "Here is the job description text:\n"
            f"{text}"
        )
    def _parse_with_qwen(self) -> Dict:
        if not self.jd_text:
            logger.warning("No job description text extracted, skipping parsing")
            return {"error": "No JD text extracted"}

        prompt = self._format_prompt(self.jd_text)
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "Referer": "http://localhost"
        }

        payload = {
            "model": QWEN_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 15000
        }

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=600
            )
            response.raise_for_status()
            result = response.json()

            choices = result.get("choices", [])
            if not choices:
                raise ValueError("No choices returned from model.")

            content = choices[0].get("message", {}).get("content", "")
            if not content:
                raise ValueError("No content found in model response.")

            if "```" in content:
                code_blocks = content.split("```")
                for block in code_blocks:
                    block = block.strip()
                    if block.startswith("json"):
                        block = block[4:].strip()
                    if block.startswith("{") and block.endswith("}"):
                        content = block
                        break

            try:
                return json.loads(content)
            except json.JSONDecodeError as jde:
                logger.error(f"JSON parsing error: {jde}")
                try:
                    content = content.strip()
                    if content.count('{') > content.count('}'):
                        content += '}' * (content.count('{') - content.count('}'))
                    return json.loads(content)
                except:
                    return {"error": "Invalid JSON format in model response.", "raw_output": content}

        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {e}")
            return {"error": f"API request failed: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return {"error": str(e)}

    def _save_json_output(self):
        if not self.qwen_result:
            logger.warning(f"No valid JSON data to save for {self.jd_name}")
            return

        # Use consistent path with the one defined at class level
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        base_name = os.path.splitext(self.jd_name)[0]
        json_filename = f"{base_name}.json"
        json_path = os.path.join(OUTPUT_DIR, json_filename)  # Use the original filename

        try:
            logger.info(f"Attempting to save to: {json_path}")
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(self.qwen_result, f, indent=2, ensure_ascii=False)

            if os.path.exists(json_path):
                logger.info(f"Successfully saved JSON data to {json_path}")
            else:
                logger.error(f"Failed to save: File does not exist after saving operation")
        except Exception as e:
            logger.error(f"Error saving JSON data: {e}")
            
    def get_JSON(self) -> dict:
        return self.qwen_result


