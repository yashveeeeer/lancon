import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Translations are updated with the more engaging examples from your image
const translations = {
  en: {
    appTitle: "LANCON",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    loginButton: "Login",
    heroTitle: "Speak Their Language. Instantly.",
    heroSubtitle: "Chat with your friends in Japan in real-time. You type in English, they read in Japanese. They reply in Japanese, you read in English. Break the language barrier, not the conversation.",
    ctaButton: "Start Chatting Now",
    howItWorksTitle: "Effortless Two-Way Communication",
    youSend: "You Send English",
    youSendExample: "I love Naruto.",
    theyReceive: "They Receive Japanese",
    theyReceiveExample: "私はナルトが大好きです。",
    theySend: "They Send Japanese",
    theySendExample: "でも私はヴィンランド・サガのファンです",
    youReceive: "You Receive English",
    youReceiveExample: "But I'm a Vinland Saga fan.",
    feature1Title: "Live Two-Way Translation",
    feature1Text: "Our core technology translates your messages back and forth in real-time, so you can have a natural, flowing conversation without ever leaving the app.",
    feature2Title: "Fun Voice-to-Speech",
    feature2Text: "Want to know how something sounds? Record your English voice, and our app will generate the Japanese text and a spoken audio clip. It's perfect for learning and fun!",
    feature3Title: "Comfortable & Modern UI",
    feature3Text: "All this power is wrapped in a clean, intuitive interface. Enjoy our sleek dark mode, easy navigation, and a user experience designed to keep the focus on your conversation.",
    footerText: "© 2025 LANCON. All Rights Reserved."
  },
  ja: {
    appTitle: "LANCON",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    loginButton: "ログイン",
    heroTitle: "瞬時に、相手の言語で話そう。",
    heroSubtitle: "日本の友達とリアルタイムでチャット。あなたが英語で入力すると、相手は日本語で読みます。相手が日本語で返信すると、あなたは英語で読みます。会話を途切れさせることなく、言語の壁をなくしましょう。",
    ctaButton: "今すぐチャットを始める",
    howItWorksTitle: "簡単な双方向コミュニケーション",
    youSend: "あなたが英語で送信",
    youSendExample: "I love Naruto.",
    theyReceive: "相手が日本語で受信",
    theyReceiveExample: "私はナルトが大好きです。",
    theySend: "相手が日本語で送信",
    theySendExample: "でも私はヴィンランド・サガのファンです",
    youReceive: "あなたが英語で受信",
    youReceiveExample: "But I'm a Vinland Saga fan.",
    feature1Title: "リアルタイム双方向翻訳",
    feature1Text: "当社のコア技術がメッセージをリアルタイムで相互翻訳するため、アプリを離れることなく自然で流れるような会話が可能です。",
    feature2Title: "楽しい音声変換機能",
    feature2Text: "発音を知りたいですか？あなたの英語の音声を録音すると、アプリが日本語のテキストと音声クリップを生成します。学習や楽しみに最適です！",
    feature3Title: "快適でモダンなUI",
    feature3Text: "この強力な機能は、クリーンで直感的なインターフェースに包まれています。洗練されたダークモード、簡単なナビゲーション、会話に集中できるデザインをお楽しみください。",
    footerText: "© 2025 LANCON. 無断複写・転載を禁じます。"
  }
};


function HomePage() {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('en');
  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('lancon-language', lang);
  };

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('lancon-theme', JSON.stringify(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('lancon-language');
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleNavigateToLogin = () => { navigate("/login"); };

  const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
  const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
  const BrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="sticky top-0 z-20 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold text-white tracking-wide">{t("appTitle")}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => changeLanguage("en")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'en' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>English</button>
                        <button onClick={() => changeLanguage("ja")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'ja' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>日本語</button>
                    </div>
                    <button className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30" onClick={toggleTheme}>{darkMode ? t("lightMode") : t("darkMode")}</button>
                    <button onClick={handleNavigateToLogin} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition">{t("loginButton")}</button>
                </div>
            </div>
        </header>

        <main className="flex-grow">
          <section className="flex items-center justify-center text-center py-20 px-4 bg-white dark:bg-gray-800">
             {/* Hero section is unchanged */}
            <div className="w-full max-w-4xl">
              <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">{t("heroTitle")}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">{t("heroSubtitle")}</p>
              <div className="flex justify-center items-center space-x-4 text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-8"><span>🇺🇸</span><span className="text-indigo-500">➔</span><span>🇯🇵</span></div>
              <button onClick={handleNavigateToLogin} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-lg transition transform hover:scale-105">{t("ctaButton")}</button>
            </div>
          </section>
          
          {/* How It Works Section - REBUILT TO MATCH YOUR IMAGE */}
          <section className="py-20 px-4">
            <div className="container mx-auto text-center">
                <h3 className="text-3xl font-bold mb-16">{t("howItWorksTitle")}</h3>
                <div className="relative max-w-5xl mx-auto">
                    {/* The Grid for the bubbles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12">
                        {/* Left Column */}
                        <div className="flex flex-col justify-between gap-12">
                            <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-left text-lg">
                                <strong className="text-gray-500 dark:text-gray-400">{t("youSend")}</strong>
                                <p className="mt-1">{t("youSendExample")}</p>
                            </div>
                            <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-left text-lg">
                                <strong className="text-gray-500 dark:text-gray-400">{t("theySend")}</strong>
                                <p className="mt-1">{t("theySendExample")}</p>
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="flex flex-col justify-between gap-12">
                            <div className="w-full p-4 bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-100 rounded-lg shadow-lg text-left text-lg">
                                <strong className="text-indigo-600 dark:text-indigo-300">{t("theyReceive")}</strong>
                                <p className="mt-1">{t("theyReceiveExample")}</p>
                            </div>
                            <div className="w-full p-4 bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-100 rounded-lg shadow-lg text-left text-lg">
                                <strong className="text-indigo-600 dark:text-indigo-300">{t("youReceive")}</strong>
                                <p className="mt-1">{t("youReceiveExample")}</p>
                            </div>
                        </div>
                    </div>
                    {/* Absolutely positioned arrows for larger screens */}
                    <div className="hidden md:block absolute inset-0">
                        <div className="flex flex-col justify-around items-center h-full text-3xl text-indigo-500 dark:text-indigo-400 font-bold">
                            <div>→</div>
                            <div>←</div>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          <section className="py-20 bg-white dark:bg-gray-800 transition-colors">
            {/* Features section is unchanged */}
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl shadow-lg text-center"><div className="flex justify-center mb-4"><ChatIcon /></div><h3 className="text-2xl font-bold mb-3">{t("feature1Title")}</h3><p className="text-gray-600 dark:text-gray-300">{t("feature1Text")}</p></div>
                <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl shadow-lg text-center"><div className="flex justify-center mb-4"><MicIcon /></div><h3 className="text-2xl font-bold mb-3">{t("feature2Title")}</h3><p className="text-gray-600 dark:text-gray-300">{t("feature2Text")}</p></div>
                <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl shadow-lg text-center"><div className="flex justify-center mb-4"><BrushIcon /></div><h3 className="text-2xl font-bold mb-3">{t("feature3Title")}</h3><p className="text-gray-600 dark:text-gray-300">{t("feature3Text")}</p></div>
            </div>
          </section>
        </main>
        
        <footer className="bg-gray-200 dark:bg-gray-800 py-6">
            <div className="container mx-auto text-center text-gray-600 dark:text-gray-400"><p>{t("footerText")}</p></div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;