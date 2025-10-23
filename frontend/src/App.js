// src/App.js
import React from 'react';
import Recorder from './components/Recorder';
import SignPage from './components/SignIn.jsx';
import Socket from './components/socketss.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogInPage from './components/Login.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import MessagingPage from './components/userPage.jsx'
import ProfilePage from './components/profile.jsx';

const router = createBrowserRouter([
  {path:'/',element:<MessagingPage/>},
  { path: '/signup', element: <SignPage /> },
  { path: '/login', element: <LogInPage /> },

  {
    element: <ProtectedRoutes />,
    children: [
      { path: '/recorder', element: <Recorder /> },
      { path: '/chat', element: <Socket /> },
      {path:'/profile',element:<ProfilePage/>},
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
