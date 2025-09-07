import React, { useState } from 'react';

// The main App component that renders the SignPage.
const App = () => {
  return (
    <div className="bg-[#E4E3E5] min-h-screen flex items-center justify-center p-4">
      <SignPage />
    </div>
  );
};
// Translation object

const translations = {
  en: {
    SignTitle: "CREATE YOUR ACCOUNT",
    username: "Username",
    email:"Email",
    password: "Password", 
    signinButton: "Sign Up",
    login: "Log In",
    SigningIn: "Signing in...",
    accountver:"Already have an account?",
    processing:"Processing...",
    registration:"Registration successful!"
  },
  ja: {
    SignTitle: "アカウントを作成する",
    username: "ユーザー名",
    email:"メールアドレス",
    password: "パスワード",
    signinButton: "サインアップ",
    login: "ログイン",
    SigningIn: "サインイン中...",
    accountver:"すでにアカウントをお持ちですか？",
    processing:"処理中...",
    registration:"登録が完了しました！"
  }
};

// The SignPage component handles the user interface and form logic for registration.
const SignPage = () => {
  // State variables to store the user's input.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Added email state
  const [currentLang, setCurrentLang] = useState('en');
  
  // State for a message to the user after form submission.
  const [message, setMessage] = useState('');

  // Translation Function
  const t = (key)=> translations[currentLang][key] || key;

  // Language change Function
  const changeLanguage = (lang)=>{
    setCurrentLang(lang);
  }

  // Handles the form submission event.
  // It prevents the default browser behavior and sends data to the backend.
  const handleSubmit = async (event) => {
    // Prevent the form from reloading the page.
    event.preventDefault();
    
    setMessage(t("processing"));
    
    try {
      // Send the data to your FastAPI backend's registration endpoint.
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }), // Sent email as well
      });

      // Get the JSON data from the response.
      const data = await response.json();
      
      // Check if the response was successful (status code 200-299).
      if (response.ok) {
        setMessage(t("registration"));
        // Reset the form fields on success.
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
    }
  };

  return (
    <div className="w-full max-w-md bg-[#D4D3D4] p-8 rounded-lg shadow-xl border-4 border-black">
      <h2 className="text-3xl font-extrabold text-black text-center mb-6" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
        {t("SignTitle")}
      </h2>
      
      {/* The main sign-up form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-bold text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}
          >
            {t("username")}
          </label>
          <div className="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border-2 border-black rounded-lg shadow-sm placeholder-gray-500 bg-[#E4E3E5] text-black focus:outline-none focus:ring-[#8080FF] focus:border-[#8080FF] sm:text-sm"
              placeholder="Choose a username"
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-bold text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}
          >
            {t("email")}
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border-2 border-black rounded-lg shadow-sm placeholder-gray-500 bg-[#E4E3E5] text-black focus:outline-none focus:ring-[#8080FF] focus:border-[#8080FF] sm:text-sm"
              placeholder="Your email address"
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-bold text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}
          >
            {t("password")}
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border-2 border-black rounded-lg shadow-sm placeholder-gray-500 bg-[#E4E3E5] text-black focus:outline-none focus:ring-[#8080FF] focus:border-[#8080FF] sm:text-sm"
              placeholder="Create a strong password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border-2 border-black rounded-lg shadow-lg text-lg font-bold text-white bg-[#8080FF] hover:bg-[#A0A0FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8080FF] transition-colors"
          >
            {t("signinButton")}
          </button>
        </div>
      </form>

      {/* A simple link to the Log-in page */}
      <div className="mt-4 text-center text-sm">
        <span className="text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
          {t("accountver")}
        </span>
        <a href="http://localhost:3000/Login" className="font-bold text-[#8080FF] hover:underline" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
          {t("login")}
        </a>
      </div>
      
      {/* Display a message to the user if one exists. */}
      {message && (
        <div className={`mt-6 text-center text-sm font-bold ${message.startsWith('Error') ? 'text-red-600' : 'text-blue-600'}`}>
          {message}
        </div>
      )}
      {/* Language Switcher */}
      <div className='mt-4 flex justify-center gap-2'>
        <button 
          onClick={() => changeLanguage("en")} 
          className={`px-3 py-1 border rounded ${currentLang === 'en' ? 'bg-blue-200' : ''}`}
        >
          English
        </button>  
        <button 
          onClick={() => changeLanguage("ja")} 
          className={`px-3 py-1 border rounded ${currentLang === 'ja' ? 'bg-blue-200' : ''}`}
        >
          日本語
        </button>   
      </div>
    </div>
  );
};

export default App;
