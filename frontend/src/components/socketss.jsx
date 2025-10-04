import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

// Translation object for Chat component
const translations = {
  en: {
    appTitle: "LANCON",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    userIdPlaceholder: "Enter your user ID (e.g., alice)",
    joinButton: "Join",
    loggedInAs: "Logged in as:",
    sendToPlaceholder: "Send to user...",
    messagePlaceholder: "Type a message...",
    sendButton: "Send",
    noMessages: "No messages yet...",
    youTo: "You to",
    says: "says:",
    server: "Server:",
    signout:"SignOut"
  },
  ja: {
    appTitle: "LANCON",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    userIdPlaceholder: "ユーザーIDを入力してください (例: alice)",
    joinButton: "参加",
    loggedInAs: "ログイン中:",
    sendToPlaceholder: "送信先ユーザー...",
    messagePlaceholder: "メッセージを入力...",
    sendButton: "送信",
    noMessages: "まだメッセージがありません...",
    youTo: "あなたから",
    says: "さんより:",
    server: "サーバー:",
    signout:"ログアウト"
  }
};

function Chat() {
  useEffect(() => {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    setUserId(savedUser); // auto-login
  }
}, []);

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [to, setTo] = useState(""); // recipient
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // theme toggle
  const [currentLang, setCurrentLang] = useState('en'); // Language state
  const ws = useRef(null);

  // Translation function - moved outside of useEffect dependency
  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  // Language change function
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
  };

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("access_token");
    ws.current = new WebSocket(`ws://localhost:8000/ws/${userId}?token=${token}`);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          `${data.from} ${t("says")} ${data.message}`,
        ]);
      } catch {
        setMessages((prev) => [...prev, `${t("server")} ${event.data}`]);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [userId, t]); // Added 't' to dependency array

  const sendMessage = () => {
    if (
      ws.current &&
      ws.current.readyState === WebSocket.OPEN &&
      message.trim() &&
      to.trim()
    ) {
      ws.current.send(JSON.stringify({ to, message }));
      setMessages((prev) => [...prev, `${t("youTo")} ${to}: ${message}`]);
      setMessage("");
    }
  };

  const handleSignOut=()=>{
    console.log(localStorage)
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
        
          <div className="sticky top-0 z-20 p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md backdrop-blur-md">
            <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-indigo-600 hover:bg-red-500 text-white font-medium rounded-lg transition">
              {t("signout")}
            </button>
          </div>
          <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">

              {/* 🔹 Header */}
              <div className="flex justify-between items-center bg-indigo-600 dark:bg-indigo-700 px-4 py-3">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  {t("appTitle")}
                </h1>
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? t("lightMode") : t("darkMode")}
                  </button>
                </div>
              </div>

              {/* 🔹 Language Switcher - Fixed styling for light mode */}
              <div className="flex justify-center gap-2 p-2 bg-gray-50 dark:bg-gray-700">
                <button 
                  onClick={() => changeLanguage("en")} 
                  className={`px-3 py-1 text-xs border rounded transition-colors ${
                    currentLang === 'en' 
                      ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600' 
                      : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
                  }`}
                >
                  English
                </button>  
                <button 
                  onClick={() => changeLanguage("ja")} 
                  className={`px-3 py-1 text-xs border rounded transition-colors ${
                    currentLang === 'ja' 
                      ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600' 
                      : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
                  }`}
                >
                  日本語
                </button>   
              </div>

              {/* 🔹 Chat body */}
              <div className="p-6">
                  <>
                    <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {t("loggedInAs")} <span className="font-semibold">{userId}</span>
                    </h3>

                    <input
                      className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-gray-700 dark:border-gray-600"
                      placeholder={t("sendToPlaceholder")}
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
                        placeholder={t("messagePlaceholder")}
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
                        {t("sendButton")}
                      </button>
                    </div>

                    <div className="border rounded-lg p-3 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition-colors">
                      {messages.length === 0 ? (
                        <p className="text-gray-400 text-center">{t("noMessages")}</p>
                      ) : (
                        messages.map((msg, i) => (
                          <p
                            key={i}
                            className={`mb-1 p-2 rounded-lg text-sm ${
                              msg.includes(t("youTo"))
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
              </div>
            </div>
          </div>
        </div>
  );
}

export default Chat;