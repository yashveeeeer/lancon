import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Translations are unchanged
const translations = {
  en: {
    appTitle: "LANCON",
    homeButton: "Home",
    loginButton: "Log In",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    signTitle: "Create Your Account",
    subtitle: "Join the conversation today.",
    username: "Username",
    fullname: "Full name",
    email: "Email",
    password: "Password",
    signinButton: "Sign Up",
    accountver: "Already have an account?",
    processing: "Processing...",
    registration: "Registration successful! You can now log in.",
    usernamePlaceholder: "Choose a username",
    fullnamePlaceholder: "Enter your full name",
    emailPlaceholder: "Your email address",
    passwordPlaceholder: "Create a strong password",
    footerText: "© 2025 LANCON. All Rights Reserved."
  },
  ja: {
    appTitle: "LANCON",
    homeButton: "ホーム",
    loginButton: "ログイン",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    signTitle: "アカウントを作成する",
    subtitle: "今日から会話に参加しましょう。",
    username: "ユーザー名",
    fullname:"フルネーム",
    email: "メールアドレス",
    password: "パスワード",
    signinButton: "サインアップ",
    accountver: "すでにアカウントをお持ちですか？",
    processing: "処理中...",
    registration: "登録が完了しました！ログインしてください。",
    usernamePlaceholder: "ユーザー名を選択してください",
    fullnamePlaceholder: "フルネームを入力してください",
    emailPlaceholder: "メールアドレスを入力してください",
    passwordPlaceholder: "強力なパスワードを作成してください",
    footerText: "© 2025 LANCON. 無断複写・転載を禁じます。"
  }
};

const SignPage = () => {
  // --- YOUR ORIGINAL CORE LOGIC (100% UNCHANGED) ---
  const [username, setUsername] = useState('');
  const [fullname,setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const [darkMode, setDarkMode] = useState(()=>{
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('lancon-language', lang)
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(t("processing"));

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ username, fullname, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t("registration"));
        setFullname('');
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        setMessage(`Error: ${data.detail || 'Something went wrong.'}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- END OF YOUR ORIGINAL CORE LOGIC ---

  // UI Helper Icons
  const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
  const IdIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" /></svg>;
  const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;
  const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
  const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;

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
                    <button onClick={() => navigate("/login")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition">{t("loginButton")}</button>
                </div>
            </div>
        </header>

        {/* 🔹 Main Content Area */}
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">
            <div className="p-8 space-y-6">

              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4"><UserPlusIcon /></div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("signTitle")}</h2>
                <p className="text-gray-600 dark:text-gray-300">{t("subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username with Icon */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("username")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon /></div>
                    <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t("usernamePlaceholder")} disabled={isLoading} />
                  </div>
                </div>

                {/* Fullname with Icon */}
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("fullname")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdIcon /></div>
                    <input id="fullname" type="text" required value={fullname} onChange={(e) => setFullname(e.target.value)} autoComplete="off" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t("fullnamePlaceholder")} disabled={isLoading} />
                  </div>
                </div>

                {/* Email with Icon */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("email")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><EmailIcon /></div>
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t("emailPlaceholder")} disabled={isLoading} />
                  </div>
                </div>

                {/* Password with Icon */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("password")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon /></div>
                    <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={t("passwordPlaceholder")} disabled={isLoading} />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all pt-4">
                  {isLoading ? (<>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t("processing")}
                  </>) : (t("signinButton"))}
                </button>
              </form>

              {message && (
                <div className="text-center text-sm font-medium">
                  <p className={`${message.startsWith('Error') || message.includes('Network') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
                </div>
              )}

              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("accountver")}{' '}
                  <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    {t("loginButton")}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* 🔹 Consistent Global Footer */}
        <footer className="bg-gray-200 dark:bg-gray-800 py-6">
            <div className="container mx-auto text-center text-gray-600 dark:text-gray-400"><p>{t("footerText")}</p></div>
        </footer>
      </div>
    </div>
  );
};

export default SignPage;
