import React from 'react';
import styles from '../styles/DescriptionModal.module.css';

const DescriptionModal = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;