import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const translations = {
  en: {
    appTitle: "LANCON",
    homeButton: "Home",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    loginTitle: "Login",
    subtitle: "Sign in to your account",
    username: "Username",
    password: "Password",
    loginButton: "Login",
    signup: "Sign up",
    loggingIn: "Logging in...",
    accountexp: "Don't have an account?",
    usernamePlaceholder: "Enter your username",
    passwordPlaceholder: "Enter your password",
    loginSuccessful: "Login successful!",
    somethingWentWrong: "Something went wrong.",
    networkError: "Network error:",
    error: "Error:",
    footerText: "© 2025 LANCON. All Rights Reserved.",
    demoTitle: "Try Demo Accounts",
    demoDescription: "Use these credentials to test the application:",
    demoUser1: "First User:",
    demoUser2: "Second User:",
    demoNote: "Open in two browsers to test real-time chat"
  },
  ja: {
    appTitle: "LANCON",
    homeButton: "ホーム",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    loginTitle: "ログイン",
    subtitle: "アカウントにサインイン",
    username: "ユーザー名",
    password: "パスワード",
    loginButton: "ログイン",
    signup: "サインアップ",
    loggingIn: "ログイン中...",
    accountexp: "アカウントをお持ちではありませんか？",
    usernamePlaceholder: "ユーザー名を入力してください",
    passwordPlaceholder: "パスワードを入力してください",
    loginSuccessful: "ログイン成功！",
    somethingWentWrong: "何か問題が発生しました。",
    networkError: "ネットワークエラー：",
    error: "エラー：",
    footerText: "© 2025 LANCON. 無断複写・転載を禁じます。",
    demoTitle: "デモアカウント",
    demoDescription: "以下の認証情報でアプリをお試しください：",
    demoUser1: "ユーザー1：",
    demoUser2: "ユーザー2：",
    demoNote: "リアルタイムチャットをテストするには2つのブラウザで開いてください"
  }
};

// The LoginPage component handles the user interface and form logic for user login.
const LoginPage = () => {
  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // Track message type separately
  const [currentLang, setCurrentLang] = useState('en');
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize theme from localStorage
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Translation function - memoized to fix React Hook warning
  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  // Language change function with localStorage persistence
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('lancon-language', lang);
  };

  // Theme toggle with localStorage persistence
  const toggleTheme = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('lancon-theme', JSON.stringify(newValue));
      return newValue;
    });
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('lancon-language');
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Get translated message based on type and current language
  const getDisplayMessage = () => {
    switch (messageType) {
      case 'success':
        return t("loginSuccessful");
      case 'loading':
        return t("loggingIn");
      case 'error':
        return `${t("error")} ${message}`;
      case 'network':
        return `${t("networkError")} ${message}`;
      default:
        return message;
    }
  };

  // Handles the form submission event.
  const handleSubmit = async (event) => {
    // Prevent the form from reloading the page.
    event.preventDefault();
    setMessageType('loading');
    setMessage('');
    setIsLoading(true);

    try {
      // Send the data to your FastAPI backend's login endpoint.
      const response = await fetch('http://localhost:8000/users/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ username, password }),
      });

      // Get the JSON data from the response.
      const data = await response.json();

      // Check if the response was successful (status code 200-299).
      if (response.ok) {
        setMessageType('success');
        setMessage('');
        // You can save the token here for future use, but for now we'll just log it.
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("username", data.username);
        // Clear form fields on success
        setUsername('');
        setPassword('');
        navigate("/recorder");  
      } else {
        // Handle backend errors and display the translated error message.
        const errorMsg = data.detail || t("somethingWentWrong");
        setMessageType('error');
        setMessage(errorMsg);
      }
    } catch (error) {
      // Handle network or other errors with translated message.
      setMessageType('network');
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // UI Helper Icons
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

        {/* 🔹 Consistent Global Header */}
        <header className="sticky top-0 z-20 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold text-white tracking-wide" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>{t("appTitle")}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => changeLanguage("en")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'en' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>English</button>
                        <button onClick={() => changeLanguage("ja")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'ja' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>日本語</button>
                    </div>
                    <button className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30" onClick={toggleTheme}>{darkMode ? t("lightMode") : t("darkMode")}</button>
                    <button onClick={() => navigate("/")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition">{t("homeButton")}</button>
                </div>
            </div>
        </header>

        {/* 🔹 Main Content Area */}
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="flex gap-8 w-full max-w-5xl">
            {/* Demo Credentials Card */}
            <div className="hidden md:block w-80">
              <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("demoTitle")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  {t("demoDescription")}
                </p>
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-800 rounded-lg">
                    <p className="font-medium text-indigo-900 dark:text-white">{t("demoUser1")}</p>
                    <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                      <p>Username: <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.5 rounded">username1</span></p>
                      <p>Password: <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.5 rounded">username1</span></p>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-800 rounded-lg">
                    <p className="font-medium text-indigo-900 dark:text-white">{t("demoUser2")}</p>
                    <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                      <p>Username: <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.5 rounded">username2</span></p>
                      <p>Password: <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.5 rounded">username2</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300 italic mt-4">
                    {t("demoNote")}
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Login Form - wrap in a div */}
            <div className="w-full max-w-md">
              <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">
                <div className="p-8 space-y-6">

                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("loginTitle")}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{t("subtitle")}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("username")}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon /></div>
                        <input id="username" type="text" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                            placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder={t("usernamePlaceholder")} disabled={isLoading} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("password")}</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon /></div>
                        <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={t("passwordPlaceholder")} disabled={isLoading} />
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg 
                      shadow-sm text-sm font-medium text-white 
                      bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                      dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isLoading ? (<>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>{t("loggingIn")}</span>
                      </>) : (t("loginButton"))}
                    </button>
                  </form>

                  {/* Your original message display logic and styling */}
                  {messageType && (
                    <div className="text-center" role="status" aria-live="polite">
                        <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${messageType === 'error' || messageType === 'network' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'}`}>
                        {getDisplayMessage()}
                        </div>
                    </div>
                  )}

                  <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("accountexp")}{' '}
                     <Link to="/Signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                        {t("signup")}
                     </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-200 dark:bg-gray-800 py-6">
            <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
                <p>{t("footerText")}</p>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;

