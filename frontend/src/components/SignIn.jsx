import React, { useState } from 'react';

// The main App component that renders the SignPage.
const App = () => {
  return (
    <div className="bg-[#E4E3E5] min-h-screen flex items-center justify-center p-4">
      <SignPage />
    </div>
  );
};

// The SignPage component handles the user interface and form logic for registration.
const SignPage = () => {
  // State variables to store the user's input.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Added email state
  
  // State for a message to the user after form submission.
  const [message, setMessage] = useState('');

  // Handles the form submission event.
  // It prevents the default browser behavior and sends data to the backend.
  const handleSubmit = async (event) => {
    // Prevent the form from reloading the page.
    event.preventDefault();
    
    setMessage('Processing...');
    
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
        setMessage('Registration successful!');
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
        CREATE YOUR ACCOUNT
      </h2>
      
      {/* The main sign-up form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-bold text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}
          >
            Username
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
            Email
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
            Password
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
            Sign Up
          </button>
        </div>
      </form>

      {/* A simple link to the sign-up page */}
      <div className="mt-4 text-center text-sm">
        <span className="text-black" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
          Already have an account? 
        </span>
        <a href="http://localhost:3000/Login" className="font-bold text-[#8080FF] hover:underline" style={{fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
          Log In
        </a>
      </div>
      
      {/* Display a message to the user if one exists. */}
      {message && (
        <div className={`mt-6 text-center text-sm font-bold ${message.startsWith('Error') ? 'text-red-600' : 'text-blue-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
