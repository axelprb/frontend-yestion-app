import React, { useState } from 'react';
import styles from '../styles/NewTask.module.css';
import { toast } from 'react-toastify';

const NewTask = ({ isOpen, onClose, onSubmit, projects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    due_date: '',
    priority_id: '1',
    status_id: '1'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.project_id || !formData.due_date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
    
    setFormData({
      title: '',
      description: '',
      project_id: '',
      due_date: '',
      priority_id: '1',
      status_id: '1'
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>New Task</h2>
        
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
            <label htmlFor="project_id">Project <span className={styles.required}>*</span></label>
            <select
              id="project_id"
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              required
              className={styles.input}
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
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
              <option value="">Select priority</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
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
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTask;