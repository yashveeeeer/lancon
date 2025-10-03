from pydantic import BaseModel
from datetime import datetime
from typing import Optional

#Message Models

class Message(BaseModel):
    sender: str
    receiver:str
    text:str
    timestamp: datetime=datetime.utcnow()

