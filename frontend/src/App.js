// src/App.js
import React from 'react';
import Recorder from './components/Recorder';

import Socket from './components/socketss.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: '/', element: <Recorder /> },
  { path: '/ws/chat', element: <Socket /> }
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
