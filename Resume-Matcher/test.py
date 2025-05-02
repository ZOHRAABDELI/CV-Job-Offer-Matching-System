import requests
import json
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Constants
QWEN_MODEL = "qwen/qwen2.5-vl-72b-instruct:free"
OPENROUTER_API_KEY = "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"

def test_openrouter_connection():
    """Simple test to check if the OpenRouter API is responding with the Qwen model."""
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "api-test"
    }
    
    payload = {
        "model": QWEN_MODEL,
        "messages": [{"role": "user", "content": "Hello, can you parse this simple test message?"}],
        "max_tokens": 500
    }
    
    logger.info(f"Testing connection to OpenRouter API with model: {QWEN_MODEL}")
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # Log response status and headers for debugging
        logger.info(f"Response status code: {response.status_code}")
        logger.info(f"Response headers: {response.headers}")
        
        if response.status_code == 200:
            result = response.json()
            
            # Print the full response for debugging
            logger.info(f"Full response: {json.dumps(result, indent=2)}")
            
            choices = result.get("choices", [])
            if choices:
                content = choices[0].get("message", {}).get("content", "")
                logger.info(f"Model response content: {content}")
                return True, content
            else:
                logger.error("No choices returned from model.")
                return False, "No choices in response"
        else:
            logger.error(f"API request failed with status code: {response.status_code}")
            logger.error(f"Response text: {response.text}")
            return False, response.text
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Request exception: {e}")
        return False, str(e)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return False, str(e)

if __name__ == "__main__":
    success, response = test_openrouter_connection()
    if success:
        print("✅ API test successful!")
        print(f"Model response: {response}")
    else:
        print("❌ API test failed!")
        print(f"Error: {response}")