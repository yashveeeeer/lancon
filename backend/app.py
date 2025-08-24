from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile
from translation.trans import Transcribe_audio
from chat.connection import ConnectionManager

# now mount the socket io app to fastapi so that all the traffic that fastapi gets can be routed towards teh socketio app

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


@app.get("/")
async def data():
    return FileResponse("index.html")

manager = ConnectionManager()

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket:WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"we have a messgae called as {data}")
           
            # await websocket.send_text(f"Messgae text was:{data}")
    except Exception as e:
        print(f"An error Occured {e}")



