from fastapi import APIRouter, HTTPException, Body, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.database.connection import user_collection


from app.models.user import User, Token, UserInDB
from app.auth.dependencies import get_password_hash, verify_password, create_access_token, get_current_user_from_token
from datetime import timedelta

router = APIRouter(prefix="/users", tags=["users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

@router.post("/register", response_description="Register a new user", status_code=status.HTTP_201_CREATED, response_model=dict)
async def register(user_data: dict = Body(...)):
    """Handles new user registration."""
    username = user_data.get("username")
    password = user_data.get("password")
    email = user_data.get("email")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")
        
    if await user_collection.find_one({"username": username}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(password)
    user_in_db = UserInDB(
        username=username,
        email=email,
        full_name=None,
        hashed_password=hashed_password
    )
    
    await user_collection.insert_one(user_in_db.dict())
    
    return {"message": "User registered successfully"}

@router.post("/token", response_description="Login and get token", response_model=Token)
async def login_for_access_token(user_data: dict = Body(...)):
    """Handles user login and returns a JWT token."""
    username = user_data.get("username")
    password = user_data.get("password")
    
    user_in_db = await user_collection.find_one({"username": username})
    
    if not user_in_db or not verify_password(password, user_in_db['hashed_password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user_in_db["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me/", response_model=User)
async def read_users_me(current_user: UserInDB = Depends(get_current_user_from_token)):
    """A protected endpoint to get the current user's details."""
    return current_user
