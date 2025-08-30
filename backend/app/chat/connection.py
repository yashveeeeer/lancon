from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Keep track of active users: user_id -> websocket
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        """Register a new connection"""
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        """Remove a connection if user disconnects"""
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, message: str, user_id: str):
        """Send a message only to a specific user"""
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        """Send a message to all users (if you need chatroom mode)"""
        for ws in self.active_connections.values():
            await ws.send_text(message)
