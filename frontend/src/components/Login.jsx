import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// The main App component that renders the LoginPage.
const App = () => {
  return (
    <div className="bg-[#E4E3E5] min-h-screen flex items-center justify-center p-4">
      <LoginPage />
    </div>
  );
};

// Translation object
const translations = {
  en: {
    loginTitle: "Login",
    username: "Username",
    password: "Password", 
    loginButton: "Login",
    signup: "Sign up",
    loggingIn: "Logging in...",
    accountexp: "Don't have an account?"
  },
  ja: {
    loginTitle: "ログイン",
    username: "ユーザー名",
    password: "パスワード",
    loginButton: "ログイン", 
    signup: "サインアップ",
    loggingIn: "ログイン中...",
    accountexp: "アカウントをお持ちではありませんか？"
  }
};

// The LoginPage component handles the user interface and form logic for user login.
const LoginPage = () => {
  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const navigate = useNavigate();

  // Simple translation function
  const t = (key) => translations[currentLang][key] || key;

  // Language change function
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
  };

  // Handles the form submission event.
  const handleSubmit = async (event) => {
    // Prevent the form from reloading the page.
    event.preventDefault();
    setMessage(t("loggingIn"));
    
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
        setMessage('Login successful!');
        // You can save the token here for future use, but for now we'll just log it.
        localStorage.setItem("access_token",data.access_token)
        // Clear form fields on success
        setUsername('');
        setPassword('');
        navigate("/recorder");  
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
        {t("loginTitle")}
      </h2>
      
      {/* The main login form */}
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
              placeholder="Enter your username"
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border-2 border-black rounded-lg shadow-sm placeholder-gray-500 bg-[#E4E3E5] text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8080FF] sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border-2 border-black rounded-lg shadow-lg text-lg font-bold text-white bg-[#8080FF] hover:bg-[#A0A0FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8080FF] transition-colors"
          >
            {t("loginButton")}
          </button>
        </div>
      </form>
      
      {/* Display a message to the user if one exists. */}
      {message && (
        <div className={`mt-6 text-center text-sm font-bold ${message.startsWith('Error') ? 'text-red-600' : 'text-blue-600'}`}>
          {message}
        </div>
      )}

      {/* A simple link to the sign-up page */}
      <div className="mt-4 text-center text-sm">
        <span className="text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
          {t("accountexp")} 
        </span>
        <a href="http://localhost:3000/Signup" className="font-bold text-[#8080FF] hover:underline" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
          {t("signup")}
        </a>
      </div>

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