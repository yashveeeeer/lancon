import React, { useState, useEffect, useRef } from "react";

function Chat() {
  const [userId, setUserId] = useState("");
  const [inputId, setInputId] = useState("");
  const [to, setTo] = useState(""); // recipient
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // theme toggle
  const ws = useRef(null);

  useEffect(() => {
    if (!userId) return;

    ws.current = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          `${data.from} says: ${data.message}`,
        ]);
      } catch {
        setMessages((prev) => [...prev, `Server: ${event.data}`]);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [userId]);

  const sendMessage = () => {
    if (
      ws.current &&
      ws.current.readyState === WebSocket.OPEN &&
      message.trim() &&
      to.trim()
    ) {
      ws.current.send(JSON.stringify({ to, message }));
      setMessages((prev) => [...prev, `You to ${to}: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">
          
          {/* 🔹 Header */}
          <div className="flex justify-between items-center bg-indigo-600 dark:bg-indigo-700 px-4 py-3">
            <h1 className="text-lg font-bold text-white tracking-wide">
              LANCON
            </h1>
            <button
              className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* 🔹 Chat body */}
          <div className="p-6">
            {!userId ? (
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your user ID (e.g., alice)"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputId.trim() !== "") {
                      setUserId(inputId);
                    }
                  }}
                />
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                  onClick={() => setUserId(inputId)}
                >
                  Join
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  Logged in as: <span className="font-semibold">{userId}</span>
                </h3>

                <input
                  className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Send to user..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && to.trim() !== "") {
                      e.preventDefault();
                    }
                  }}
                />

                <div className="flex mb-3 gap-2">
                  <textarea
                    className="flex-1 p-2 border rounded-lg resize-none h-12 focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (message.trim() !== "") {
                          sendMessage();
                        }
                      }
                    }}
                  />
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>

                <div className="border rounded-lg p-3 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center">No messages yet...</p>
                  ) : (
                    messages.map((msg, i) => (
                      <p
                        key={i}
                        className={`mb-1 p-2 rounded-lg text-sm ${
                          msg.startsWith("You")
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-white self-end"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                        }`}
                      >
                        {msg}
                      </p>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
