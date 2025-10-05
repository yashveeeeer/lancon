import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

// Enhanced Translation object with all missing translations
const translations = {
  en: {
    appTitle: "LANCON Voice",
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
    loadingText: "Please wait...",
    invalidCredentials: "Invalid username or password",
    serverError: "Server error occurred",
    usernameFieldLabel: "Username input field",
    passwordFieldLabel: "Password input field",
    loginButtonLabel: "Login button",
    themeToggleLabel: "Toggle theme",
    languageToggleLabel: "Change language",
  },
  ja: {
    appTitle: "LANCON Voice",
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
    loadingText: "お待ちください...",
    invalidCredentials: "ユーザー名またはパスワードが無効です",
    serverError: "サーバーエラーが発生しました",
    usernameFieldLabel: "ユーザー名入力フィールド",
    passwordFieldLabel: "パスワード入力フィールド",
    loginButtonLabel: "ログインボタン",
    themeToggleLabel: "テーマの切り替え",
    languageToggleLabel: "言語を変更"
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        navigate("/home")
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

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">

          {/* Header */}
          <div className="flex justify-between items-center bg-indigo-600 dark:bg-indigo-700 px-6 py-4">
            <h1 className="text-xl font-bold text-white tracking-wide">
              {t("appTitle")}
            </h1>
            <div className="flex gap-2">
              <button
                className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
                onClick={toggleTheme}
                aria-label={t("themeToggleLabel")}
                title={t("themeToggleLabel")}
              >
                {darkMode ? t("lightMode") : t("darkMode")}
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={() => changeLanguage("en")}
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${currentLang === 'en'
                  ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600'
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
                }`}
              aria-label="Switch to English"
              title="Switch to English"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("ja")}
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${currentLang === 'ja'
                  ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600'
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
                }`}
              aria-label="日本語に切り替え"
              title="日本語に切り替え"
            >
              日本語
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">

            {/* Title and Subtitle */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t("loginTitle")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                {t("subtitle")}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t("username")}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t("usernamePlaceholder")}
                  disabled={isLoading}
                  aria-label={t("usernameFieldLabel")}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t("password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t("passwordPlaceholder")}
                  disabled={isLoading}
                  aria-label={t("passwordFieldLabel")}
                />
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={t("loginButtonLabel")}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                      <span>{t("loggingIn")}</span>
                    </div>
                  ) : (
                    t("loginButton")
                  )}
                </button>
              </div>
            </form>

            {/* Display message */}
            {messageType && (
              <div className="text-center" role="status" aria-live="polite">
                <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${messageType === 'error' || messageType === 'network'
                    ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800'
                    : messageType === 'loading'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800'
                      : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800'
                  }`}>
                  {messageType === 'error' || messageType === 'network' ? (
                    <span className="mr-2" aria-hidden="true">⚠️</span>
                  ) : messageType === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true"></div>
                  ) : (
                    <span className="mr-2" aria-hidden="true">✅</span>
                  )}
                  {getDisplayMessage()}
                </div>
              </div>
            )}

            {/* Sign up link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("accountexp")}{' '}
                <a
                  href="http://localhost:3000/Signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  {t("signup")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// The main App component that renders the LoginPage.
const App = () => {
  return <LoginPage />;
};

export default App;