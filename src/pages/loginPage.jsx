import React, { useState } from 'react';
import styles from '../styles/loginPage.module.css'; 
import yestionLogo from '../assets/images/logo.png'; 
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_URL = "https://api-yestion.farelfebryan.my.id";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email: email,
        password: password
      });
      
      const token = response.data.token;
      const user = response.data.user; 

      // console.log(token);
      localStorage.setItem('authToken', token);
      // console.log(localStorage.getItem('authToken'));
      
      localStorage.setItem('authUser', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success("Login successful!");
      navigate('/dashboard'); 

    } catch (error) {
      // console.error('Error login:', error);
      toast.error("Failed to login. Please check your credentials and try again.");
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        <img src={yestionLogo} alt="Yestion Logo" className={styles.logo} />
        <h1 className={styles.title}>Yestion</h1>

        <form className={styles.formCard} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.rememberGroup}>
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>

          <p className={styles.navLinkText}>
            Don't have an account?{' '}
            <NavLink to="/register" className={styles.navLink}>
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;