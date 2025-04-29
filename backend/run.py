import uvicorn
from app.config import API_HOST, API_PORT
from app.main import app

if __name__ == "__main__":
    uvicorn.run(app, host=API_HOST, port=API_PORT)
