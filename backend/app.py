from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile
app = FastAPI()

#adding CORS middleware to allow requests from specific origins
origins = [
    "http://localhost:3000",
]

#add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials= True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


@app.post("/upload-audio")
async def upload_audio(audiofile: UploadFile = File(...)):
    with open("received_audio.webm","wb") as f:
        f.write(await audiofile.read())
        return {"message" : f"Received{audiofile.filename}"}

