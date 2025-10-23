import React, { useState } from 'react';
import styles from '../styles/NewProject.module.css';

const NewTaskProject = ({ isOpen, onClose, onSubmit, initialData }) => {

  const [taskName, setTaskName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [priority, setPriority] = useState(initialData?.priority?.toString() || '');


  React.useEffect(() => {
    if (initialData) {
      setTaskName(initialData.name || '');
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate || '');
      setPriority(initialData.priority?.toString() || '');
    }
  }, [initialData]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      alert('Please fill in Task Name.');
      return;
    }


    onSubmit({
      name: taskName,
      description,
      dueDate,
      priority,
    });


    setTaskName('');
    setDescription('');
    setDueDate('');
    setPriority('');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.modalTitle}>{initialData ? 'Edit Task' : 'New Task'}</h2>

        <form onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label htmlFor="taskName" className={styles.modalLabel}>
              Task Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="taskName"
              className={styles.modalInput}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name..."
              autoFocus
              required
            />
          </div>


          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.modalLabel}>
              Description
            </label>
            <textarea
              id="description"
              className={styles.modalTextarea}
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description..."
            />
          </div>


          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="dueDate" className={styles.modalLabel}>
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className={styles.modalInput}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>


            <div className={styles.inputGroup}>
              <label htmlFor="priority" className={styles.modalLabel}>
                Priority
              </label>
              <select
                id="priority"
                className={styles.modalInput}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </select>
            </div>
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
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskProject;