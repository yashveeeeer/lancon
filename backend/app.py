from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile
from translation.trans import Transcribe_audio


latest_transcription = ""


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
async def upload_audio(audiofile: UploadFile):
    audio_bytes = await audiofile.read()
    latest_transcription=Transcribe_audio(audio_bytes)
    return latest_transcription