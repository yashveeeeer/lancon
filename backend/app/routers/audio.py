from fastapi import APIRouter, UploadFile, File
from app.translation.trans import Transcribe_audio

router = APIRouter(tags=["audio"])

@router.post("/upload-audio")
async def upload_audio(audiofile: UploadFile = File(...)):
    audio_bytes = await audiofile.read()
    latest_transcription = Transcribe_audio(audio_bytes)
    return latest_transcription