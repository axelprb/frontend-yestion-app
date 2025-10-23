import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/taskCard.module.css';
import animationStyles from '../styles/animations.module.css';
import ConfirmationModal from './ConfirmDelete';
import DescriptionModal from './DescriptionModal';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, onUpdateStatus, onDelete, onEdit, onDescriptionClick, variant = 'default' }) => {
  const navigate = useNavigate();
  
  if (!task) return null;

  const handleCardClick = (e) => {
    
    if (e.target.closest(`.${styles.deleteButton}`) || 
        e.target.closest(`.${styles.statusIcon}`) ||
        e.target.closest(`.${styles.taskDescription}`)) {
      return;
    }
    
   
    if (task.project_id && variant !== 'project') {
      navigate(`/projects/${task.project_id}`);
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return styles.priorityHigh; 
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Tomorrow';
    const today = new Date();
    const taskDate = new Date(date);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const priorityName = task.priority?.name || 'High';

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onDelete(task.id);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onEdit(task);
  };

  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`
        ${styles.card} 
        ${styles.simpleCard} 
        ${animationStyles.taskCard}
      `} 
      onClick={handleCardClick}
      style={{ 
        cursor: 'pointer',
        animationDelay: `${Math.random() * 0.5}s`
      }}
      data-status={task.status?.name?.toLowerCase() || 'todo'}
    >
      <div className={styles.header}>
        <div className={styles.taskInfo}>
          <h3 className={styles.taskName}>{task.title || 'Task Name'}</h3>
          {variant === 'project' ? (
            task.description && (
              <p 
                className={styles.taskDescription}
                onClick={(e) => {
                  e.stopPropagation();
                  onDescriptionClick(task);
                }}
                role="button"
                style={{ cursor: 'pointer' }}
                title="Click to view full description"
              >
                {task.description}
              </p>
              
            )
          ) : (
            <p className={styles.projectName}>{task.project?.name || 'Project Name'}</p>
          )}
        </div>
        <div className={styles.rightInfo}>
          <div className={styles.priorityBadge}>
            <span className={styles.priorityLabel}>Priority :</span>
            <span className={`${styles.priorityValue} ${getPriorityClass(priorityName)}`}>
              {priorityName}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <div className={styles.dueDate}>
          <span className={styles.calendarIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.6667 1.33325V3.99992" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.33331 1.33325V3.99992" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 6.66675H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Due : {formatDate(task.due_date)}
        </div>
        <div className={styles.actions}>
          {task.status_id !== 3 && onUpdateStatus && (
            <button 
              onClick={() => onUpdateStatus(task.id, task.status_id)}
              className={styles.statusIcon}
              aria-label="Update status"
            >
              ▶
            </button>
          )}
          {variant !== 'simple' && (
            <button 
            className={styles.editButton}
            onClick={handleEditClick}
            aria-label={`Edit task ${task.title}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          )}
          <button 
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            aria-label={`Delete task ${task.title}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.33331 4.00008V2.66675C5.33331 2.31313 5.47379 1.97401 5.72384 1.72396C5.97389 1.47391 6.31302 1.33342 6.66665 1.33342H9.33331C9.68694 1.33342 10.0261 1.47391 10.2761 1.72396C10.5262 1.97401 10.6666 2.31313 10.6666 2.66675V4.00008M12.6666 4.00008V13.3334C12.6666 13.687 12.5262 14.0262 12.2761 14.2762C12.0261 14.5263 11.6869 14.6667 11.3333 14.6667H4.66665C4.31302 14.6667 3.97389 14.5263 3.72384 14.2762C3.47379 14.0262 3.33331 13.687 3.33331 13.3334V4.00008H12.6666Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66669 7.33342V11.3334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.33331 7.33342V11.3334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

