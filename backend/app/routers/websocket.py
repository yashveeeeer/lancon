from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from app.chat.connection import ConnectionManager
from app.database.connection import message_collection
from app.database.connection import user_collection
from datetime import datetime
from fastapi import APIRouter, Depends
from app.translation.trans import eng_to_jap
# from app.translation.trans import english_to_japan
router = APIRouter(tags=["websocket"])

manager = ConnectionManager()


# WebSocket Endpoint for Real-time Chat
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            sender=user_id
            receiver=payload.get("to")
            text=payload.get("message")
            changer=payload.get("lang")

            #checking if receiver exists in users DB

            user_in_db = await user_collection.find_one({"username":receiver})
            if not user_in_db:
                await websocket.send_json({"error":f"User{receiver} not found"})
                continue

            message_doc={
                "sender":sender,
                "receiver":receiver,
                "text":text,
                "timestamp":datetime.utcnow()
            }

            await message_collection.insert_one(message_doc)

            if changer:
                if receiver and text:
                    new_text = eng_to_jap(text)
                    await manager.send_personal_message(
                        json.dumps({"from": user_id, "message": new_text}),
                        receiver
                    )
            else:
                if receiver and text:
                    await manager.send_personal_message(
                        json.dumps({"from": user_id, "message": text}),
                        receiver
                    )

    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print("Error:", e)