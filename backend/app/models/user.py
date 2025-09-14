from pydantic import BaseModel, Field, EmailStr
from typing import Optional


# User Models
class User(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    fullname: Optional[str] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username:str

class TokenData(BaseModel):
    username: Optional[str] = None
