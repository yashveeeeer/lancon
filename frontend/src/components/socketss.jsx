import React, { useState, useEffect, useRef } from "react";

function Socket() {
  const ws = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket("ws://localhost:8000/ws/chat");

    ws.current.onopen = () => {
      console.log("Connected to server");
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log("Disconnected from server");
      setConnected(false);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (
      ws.current &&
      ws.current.readyState === WebSocket.OPEN &&
      message.trim() !== ""
    ) {
      ws.current.send(message);
      setMessage("");
    } else {
      console.warn("Cannot send, socket not connected yet.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>FastAPI + React WebSocket Chat</h2>

      <div>Status: {connected ? "Connected" : "Disconnected"}</div>

      <div style={{ marginTop: "10px" }}>
        <input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} disabled={!connected}>
          Send
        </button>
      </div>

      <ul style={{ marginTop: "20px" }}>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default Socket;
