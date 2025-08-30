from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from app.chat.connection import ConnectionManager

router = APIRouter(tags=["websocket"])

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            target_user = payload.get("to")
            message = payload.get("message")

            if target_user and message:
                await manager.send_personal_message(
                    json.dumps({"from": user_id, "message": message}),
                    target_user
                )
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print("Error:", e)