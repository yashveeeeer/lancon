// src/App.js
import React from 'react';
import Recorder from './components/Recorder';
import SignPage from './components/SignIn.jsx';
import Socket from './components/socketss.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogInPage from './components/Login.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';

const router = createBrowserRouter([
  { path: '/', element: <LogInPage /> },
  { path: '/signup', element: <SignPage /> },
  { path: '/login', element: <LogInPage /> },

  {
    element: <ProtectedRoutes />,
    children: [
      { path: '/recorder', element: <Recorder /> },
      { path: '/ws/chat', element: <Socket /> },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
