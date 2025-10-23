import React, { useState } from 'react';
import styles from '../styles/registerPage.module.css'; 
import yestionLogo from '../assets/images/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const navigate = useNavigate(); 
  
  const API_URL = "http://70.153.82.125";

  const handleRegister = async (e) => {
    e.preventDefault(); 
  
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        name: username, 
        email: email,
        password: password,
        password_confirmation: confirmPassword 
      });

      console.log('Respon sukses:', response.data);
      toast.success("Registration successful! Please login.");
      navigate('/login');

    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          toast.error(`Registration failed: ${error.response.data.message}`);
        } 
        else if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = Object.values(errors).flat().join('\n');
          toast.error(`Registration failed:\n${errorMessages}`);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        <img src={yestionLogo} alt="Yestion Logo" className={styles.logo} />
        <h1 className={styles.title}>Yestion</h1>

        <form className={styles.formCard} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              className={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>

          <p className={styles.navLinkText}>
            Already have an account?{' '}
            <NavLink to="/login" className={styles.navLink}>
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;