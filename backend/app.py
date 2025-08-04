from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#adding CORS middleware to allow requests from specific origins
origins = [
    "http://localhost:3000",
]

#add middleware
app.middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials= True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

