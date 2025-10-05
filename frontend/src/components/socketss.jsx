import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

// Translations have been updated to better fit the new UI
const translations = {
  en: {
    appTitle: "LANCON",
    homeButton: "Home",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    loggedInAs: "You are logged in as:",
    sendToPlaceholder: "Recipient's username...",
    messagePlaceholder: "Type your message here...",
    sendButton: "Send",
    noMessages: "Your conversation will appear here.",
    youTo: "You to",
    says: "says:",
    server: "Server:",
    signout:"Sign Out",
    sendInJap:"Translate to Japanese",
    footerText: "© 2024 LANCON. All Rights Reserved."
  },
  ja: {
    appTitle: "LANCON",
    homeButton: "ホーム",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    loggedInAs: "ログイン中:",
    sendToPlaceholder: "宛先のユーザー名...",
    messagePlaceholder: "ここにメッセージを入力...",
    sendButton: "送信",
    noMessages: "会話はここに表示されます。",
    youTo: "あなたから",
    says: "さんより:",
    server: "サーバー:",
    signout:"ログアウト",
    sendInJap:"日本語に翻訳して送信",
    footerText: "© 2024 LANCON. 無断複写・転載を禁じます。"
  }
};

// A more robust toggle button component for the UI
function ToggleButton({ enabled, onToggle }) {
  return (
    <button onClick={onToggle} className={`relative flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${enabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}>
      <span aria-hidden="true" className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Chat() {
  // --- YOUR ORIGINAL CORE LOGIC (RESTORED, with the toggle fix) ---
  const [userId, setUserId] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentLang, setCurrentLang] = useState('en');
  const [isOn, setIsOn] = useState(false); // State for the Japanese toggle
  const ws = useRef(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });

  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) { setUserId(savedUser); }
  }, []);

  const changeLanguage = (lang) => { setCurrentLang(lang); localStorage.setItem('lancon-language', lang); };
  const toggleTheme = () => { setDarkMode(prev => { const val = !prev; localStorage.setItem('lancon-theme', JSON.stringify(val)); return val; }); };

  useEffect(() => {
    const savedLang = localStorage.getItem('lancon-language');
    if (savedLang && translations[savedLang]) { setCurrentLang(savedLang); }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("access_token");
    ws.current = new WebSocket(`ws://localhost:8000/ws/${userId}?token=${token}`);
    
    // YOUR ORIGINAL onmessage LOGIC IS RESTORED
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Stores messages as a string, just like your original code
        setMessages((prev) => [...prev, `${data.from} ${t("says")} ${data.message}`]);
      } catch {
        // Stores server messages as a string
        setMessages((prev) => [...prev, `${t("server")} ${event.data}`]);
      }
    };

    return () => { if (ws.current) ws.current.close(); };
  }, [userId, t]); // Your original dependency array

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && message.trim() && to.trim()) {
      // This is the one necessary fix: it uses the 'isOn' state to correctly set 'lang'
      ws.current.send(JSON.stringify({ to, message, lang: isOn }));
      
      // YOUR ORIGINAL sendMessage LOGIC IS RESTORED
      // Adds the sent message as a string to the array
      setMessages((prev) => [...prev, `${t("youTo")} ${to}: ${message}`]);
      setMessage("");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // --- END OF CORE LOGIC ---

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        <header className="sticky top-0 z-20 w-full flex-shrink-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold text-white tracking-wide" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>{t("appTitle")}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => changeLanguage("en")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'en' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>English</button>
                        <button onClick={() => changeLanguage("ja")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'ja' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>日本語</button>
                    </div>
                    <button className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30" onClick={toggleTheme}>{darkMode ? t("lightMode") : t("darkMode")}</button>
                    <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition">{t("signout")}</button>
                </div>
            </div>
        </header>

        <main className="container mx-auto flex h-full w-full max-w-4xl flex-grow flex-col p-4">
          <div className="flex h-full flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="flex-shrink-0 rounded-t-2xl border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {t("loggedInAs")} <span className="font-semibold text-indigo-600 dark:text-indigo-400">{userId}</span>
                </p>
            </div>
            
            <div className="flex-grow space-y-4 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">{t("noMessages")}</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  // This logic now works because 'msg' is a string again
                  const isSent = msg.includes(t("youTo"));
                  const isServer = msg.startsWith(t("server"));
                  
                  return (
                    <div key={i} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs rounded-2xl px-4 py-2 lg:max-w-md ${isSent ? 'rounded-br-lg bg-indigo-500 text-white' : isServer ? 'bg-gray-500 text-white' : 'rounded-bl-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                            <p className="text-sm">{msg}</p>
                        </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 rounded-b-2xl border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-3">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">👤</span>
                  <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder={t("sendToPlaceholder")} className="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={t("messagePlaceholder")} rows="3" className="w-full resize-none rounded-lg border border-gray-300 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ToggleButton enabled={isOn} onToggle={() => setIsOn(!isOn)} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("sendInJap")}</span>
                    </div>
                    <button onClick={sendMessage} className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                      {t("sendButton")}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;