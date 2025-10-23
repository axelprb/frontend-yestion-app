import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import yestionLogo from '../assets/images/logo.png'; 


const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33333 3.33334H3.33333V8.33334H8.33333V3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.6667 3.33334H11.6667V8.33334H16.6667V3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.6667 11.6667H11.6667V16.6667H16.6667V11.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33333 11.6667H3.33333V16.6667H8.33333V11.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const IconProjects = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 6.66666H9.16667L7.5 5H3.33333C2.89131 5 2.46738 5.17559 2.15482 5.48815C1.84226 5.80071 1.66667 6.22464 1.66667 6.66666V15C1.66667 15.442 1.84226 15.8659 2.15482 16.1785C2.46738 16.4911 2.89131 16.6667 3.33333 16.6667H16.6667C17.1087 16.6667 17.5326 16.4911 17.8452 16.1785C18.1577 15.8659 18.3333 15.442 18.3333 15V8.33332C18.3333 7.8913 18.1577 7.46737 17.8452 7.15481C17.5326 6.84225 17.1087 6.66666 16.6667 6.66666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66669 16.6667H4.16669C3.72466 16.6667 3.30072 16.4911 2.98816 16.1785C2.6756 15.8659 2.50002 15.442 2.50002 15V5.00001C2.50002 4.55798 2.6756 4.13404 2.98816 3.82148C3.30072 3.50892 3.72466 3.33334 4.16669 3.33334H6.66669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3333 13.3333L17.5 9.16666L13.3333 4.99999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 9.16666H6.66669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const handleLogout = async () => {
    
    try {
      
    } catch (error) {
      // console.error("Error logout:", error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/'); 
    }
  };
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        
        <div className={styles.sidebarHeader}>
          <img src={yestionLogo} alt="Yestion Logo" className={styles.logoImg} />
          <h2 className={styles.appName}>Yestion</h2>
        </div>

        <nav className={styles.sidebarNav}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            onClick={toggleSidebar}
          >
            <IconDashboard /> 
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/projects"
            className={({ isActive }) => 
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            onClick={toggleSidebar}
          >
            <IconProjects /> 
            <span>Projects</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
              <NavLink 
                to="/" 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Log out
              </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;