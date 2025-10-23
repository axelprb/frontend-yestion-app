import React, { useState } from 'react';
import styles from '../styles/NewProject.module.css';

const NewProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState('');
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit(projectName);
      setProjectName('');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.modalTitle}>New Project</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="projectName" className={styles.modalLabel}>
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              className={styles.modalInput}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              autoFocus
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;