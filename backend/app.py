from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile
from translation.trans import Transcribe_audio
from chat.connection import ConnectionManager
import json

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
    return latest_transcription

connected_users = {}
@app.get("/")
async def data():
    return FileResponse("index.html")

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Expect {"to": "bob", "message": "hi"} from client
            payload = json.loads(data)
            target_user = payload.get("to")
            message = payload.get("message")

            if target_user and message:
                await manager.send_personal_message(
                    json.dumps({"from": user_id, "message": message}),
                    target_user
                )
    except Exception as e:
        print("Error:", e)
    finally:
        manager.disconnect(user_id)



