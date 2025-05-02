from pydantic import BaseModel
from typing import Dict, List

class WeightsUpdate(BaseModel):
    Education: float
    Work_Experience: float
    Skills: float
    Experience_Requirements: float
