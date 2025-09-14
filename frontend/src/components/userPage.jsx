import React, { useState, useRef, useEffect, useCallback } from 'react';

const translations = {
  en: {
    chatTitle: "LANCON Voice",
    inputPlaceholder: "Type your message...",
    send: "Send",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    languageToggle: "Language",
    english: "English",
    japanese: "日本語",
  },
  ja: {
    chatTitle: "LANCONボイス",
    inputPlaceholder: "メッセージを入力...",
    send: "送信",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    languageToggle: "言語",
    english: "英語",
    japanese: "日本語",
  }
};

const username=localStorage.getItem("username")

const MessagingPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lancon-language');
    return saved || 'en';
  });

  const t = useCallback((key) => translations[lang][key] || key, [lang]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `You said: "${input}"` }
      ]);
    }, 800);

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('lancon-theme', JSON.stringify(newValue));
      return newValue;
    });
  };

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lancon-language', newLang);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        
        {/* Header */}
        <div className="bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-lg font-semibold">{t('chatTitle')}</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="bg-white/20 text-white text-sm px-3 py-1 rounded hover:bg-white/30"
            >
              {darkMode ? t("lightMode") : t("darkMode")}
            </button>
            <select
              value={lang}
              onChange={(e) => switchLang(e.target.value)}
              className="bg-white/20 text-white text-sm px-2 py-1 rounded hover:bg-white/30"
            >
              <option value="en">{t("english")}</option>
              <option value="ja">{t("japanese")}</option>
            </select>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-2 rounded-lg shadow text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={endRef}></div>
        </div>

        {/* Input area */}
        <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("inputPlaceholder")}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              {t("send")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
