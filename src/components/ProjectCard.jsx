import React from 'react';

import { Link } from 'react-router-dom';
import styles from '../styles/ProjectCard.module.css';


const ProjectCard = ({ project, onDelete }) => { 
 
  const calculateTaskCounts = () => {
    if (!project.tasks || !Array.isArray(project.tasks)) {
      return { not_complete: 0, on_going: 0, done: 0 };
    }

    return {
      not_complete: project.tasks.filter(task => Number(task.status_id) === 1).length,
      on_going: project.tasks.filter(task => Number(task.status_id) === 2).length,
      done: project.tasks.filter(task => Number(task.status_id) === 3).length
    };
  };

  const taskCounts = calculateTaskCounts();

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onDelete(project.id);
  }
  return (
  
    <Link to={`/projects/${project.id}`} className={styles.card}>
   
      <h3 className={styles.projectName}>{project.name}</h3>
      
      <div className={styles.taskCounts}>
        
        <div className={styles.countItem}>
          <span className={`${styles.countBadge} ${styles.notComplete}`}>
            {taskCounts.not_complete} 
          </span>
          <span className={styles.countLabel}>Not Completed</span>
        </div>
        
        <div className={styles.countItem}>
          <span className={`${styles.countBadge} ${styles.onGoing}`}>
            {taskCounts.on_going} 
          </span>
          <span className={styles.countLabel}>On-Going</span>
        </div>
        
        <div className={styles.countItem}>
          <span className={`${styles.countBadge} ${styles.done}`}>
            {taskCounts.done} 
          </span>
          <span className={styles.countLabel}>Done</span>
        </div>
        <button 
          className={styles.deleteButton} 
          onClick={handleDeleteClick}
          aria-label={`Delete project ${project.name}`} 
        >
          
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.33331 4.00008V2.66675C5.33331 2.31313 5.47379 1.97401 5.72384 1.72396C5.97389 1.47391 6.31302 1.33342 6.66665 1.33342H9.33331C9.68694 1.33342 10.0261 1.47391 10.2761 1.72396C10.5262 1.97401 10.6666 2.31313 10.6666 2.66675V4.00008M12.6666 4.00008V13.3334C12.6666 13.687 12.5262 14.0262 12.2761 14.2762C12.0261 14.5263 11.6869 14.6667 11.3333 14.6667H4.66665C4.31302 14.6667 3.97389 14.5263 3.72384 14.2762C3.47379 14.0262 3.33331 13.687 3.33331 13.3334V4.00008H12.6666Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66669 7.33342V11.3334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.33331 7.33342V11.3334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </Link>
  );
};

export default ProjectCard;