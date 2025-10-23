import React, { useState } from 'react';
import styles from '../styles/NewTask.module.css'; 

const EditTask = ({ isOpen, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    priority_id: task?.priority?.id || task?.priority_id || '1',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Edit Task</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Task Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter task name..."
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter a short description..."
              className={styles.textarea}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="due_date">Due Date <span className={styles.required}>*</span></label>
            <input
              type="date"
              id="due_date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
              className={styles.input}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priority_id">Priority</label>
            <select
              id="priority_id"
              value={formData.priority_id}
              onChange={(e) => setFormData({ ...formData, priority_id: e.target.value })}
              className={styles.input}
            >
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.buttonSecondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;