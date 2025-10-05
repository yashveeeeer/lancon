import React, { useState, useCallback, useEffect} from 'react';

// Translation object
const translations = {
  en: {
    appTitle: "LANCON",
    signTitle: "Create Your Account",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    username: "Username",
    fullname: "Full name",
    email: "Email",
    password: "Password", 
    signinButton: "Sign Up",
    login: "Log In",
    accountver: "Already have an account?",
    processing: "Processing...",
    registration: "Registration successful!",
    usernamePlaceholder: "Choose a username",
    fullnamePlaceholder: "Choose a full name",
    emailPlaceholder: "Your email address",
    passwordPlaceholder: "Create a strong password",
    themeToggleLabel: "Toggle theme",
    languageToggleLabel: "Change language"
  },
  ja: {
    appTitle: "LANCON",
    signTitle: "アカウントを作成する",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    username: "ユーザー名",
    fullname:"フルネーム",
    email: "メールアドレス",
    password: "パスワード",
    signinButton: "サインアップ",
    login: "ログイン",
    accountver: "すでにアカウントをお持ちですか？",
    processing: "処理中...",
    registration: "登録が完了しました！",
    usernamePlaceholder: "ユーザー名を選択してください",
    fullnamePlaceholder: "フルネームを選んでください",
    emailPlaceholder: "メールアドレスを入力してください",
    passwordPlaceholder: "強力なパスワードを作成してください",
    themeToggleLabel: "テーマの切り替え",
    languageToggleLabel: "言語を変更"
  }
};

// The SignPage component handles the user interface and form logic for registration.
const SignPage = () => {
  // State variables to store the user's input.
  const [username, setUsername] = useState('');
  const [fullname,setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const [darkMode, setDarkMode] = useState(()=>{
      // Initialize theme from localStorage
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // State for a message to the user after form submission.
  const [message, setMessage] = useState('');

  // Translation Function - memoized to prevent unnecessary re-renders
  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  // Language change Function
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('lancon-language', lang)
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

  // Handles the form submission event.
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsLoading(true);
    setMessage(t("processing"));
    
    try {
      // Send the data to your FastAPI backend's registration endpoint.
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, fullname, password, email }),
      });

      // Get the JSON data from the response.
      const data = await response.json();
      
      // Check if the response was successful (status code 200-299).
      if (response.ok) {
        setMessage(t("registration"));
        // Reset the form fields on success.
        setFullname('');
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        // Handle backend errors and display the error message.
        setMessage(`Error: ${data.detail || 'Something went wrong.'}`);
      }
    } catch (error) {
      // Handle network or other errors.
      setMessage(`Network error: ${error.message}`);
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
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                currentLang === 'en' 
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
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                currentLang === 'ja' 
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
          <div className="p-6">
            
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t("signTitle")}
              </h2>
            </div>
            
            {/* Sign-up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Field */}
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t("usernamePlaceholder")}
                  disabled={isLoading}
                />
              </div>

              {/* fullname Field */}
              <div>
                <label 
                  htmlFor="fullname" 
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t("fullname")}
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="fullname"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t("fullnamePlaceholder")}
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t("emailPlaceholder")}
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t("password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t("passwordPlaceholder")}
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("processing")}
                  </>
                ) : (
                  t("signinButton")
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("accountver")}{" "}
              </span>
              <a 
                href="http://localhost:3000/Login" 
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                {t("login")}
              </a>
            </div>
            
            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${
                message.startsWith('Error') || message.includes('Network error')
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
                  : message === t("processing")
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// The main App component that renders the SignPage.
const App = () => {
  return <SignPage />;
};

export default App;