import React, { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import yestionLogo from '../assets/images/logo.png'; 
import axios from 'axios';

const Navbar = ({ toggleSidebar, user, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    try {
      
    } catch (error) {
      console.error("Error logout:", error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/'); 
    }
  };

  return (
    console.log(localStorage.getItem('authUser')),
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuIcon} onClick={toggleSidebar}>☰</button>
        <img src={yestionLogo} alt="Yestion Logo" className={styles.logoImg} />
      </div>
      <div className={styles.center}>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={
            location.pathname === "/dashboard" 
              ? "Search tasks..."
              : location.pathname.includes("/projects") 
                ? location.pathname.split('/').length > 2 
                  ? "Search tasks in this project..." 
                  : "Search projects..."
                : "Search..."
          }
          className={styles.search} 
        />
      </div>

      <div className={styles.right}>
        <div className={styles.icon}>✉︎</div>
        
        <div 
          className={styles.avatarContainer}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className={styles.avatar}>
            {user && user.name ? user.name[0].toUpperCase() : 'A'}
          </div>

          {isDropdownOpen && user && (
            <div className={styles.dropdownMenu}> 
              <div className={styles.username}>
                {user.name}
              </div>
              <div className={styles.email}>
                {user.email}
              </div>
              <NavLink 
                to="/" 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Log out
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;