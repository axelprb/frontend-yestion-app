import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import Dashboard from "./pages/dashboardPage";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import Layout from './components/Layout';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <BrowserRouter>
      <ToastContainer
        position="top-right" 
        autoClose={3000}    
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/:projectId" element={<TaskPage />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
