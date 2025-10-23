import React from 'react';
import styles from '../styles/ConfirmDelete.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className={styles.modalOverlay} 
        onClick={onClose}
      />
      <div 
        className={styles.modalContent} 
        onClick={e => e.stopPropagation()}
      >
        <h2 className={styles.modalTitle}>{title || "Confirm Action"}</h2>
        <p className={styles.confirmMessage}>{message || "Are you sure?"}</p>
        <div className={styles.modalActions}>
          <button 
            type="button" 
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </button>
          <button 
            type="button"
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;