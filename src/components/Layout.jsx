import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 
import Sidebar from './Sidebar'; 
import styles from '../styles/Layout.module.css'; 
import axios from 'axios'; 

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchCallback, setSearchCallback] = useState(null);
  const navigate = useNavigate();
  
  const API_URL = "http://70.153.82.125";

  useEffect(() => {

    const token = localStorage.getItem('authToken');

    if (!token) {
     
      navigate('/login');
    } else {
      const userString =  localStorage.getItem('authUser');
      if (userString) {
        setUser(JSON.parse(userString));
      } else {
        navigate('/login');
      }
    }
  }, [navigate]); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className={`${styles.appContainer}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          user={user} 
          onSearch={(term) => searchCallback?.(term)}
        />
        
        <div className={styles.pageContent}> 
          <Outlet context={{ setSearchCallback }} /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;

