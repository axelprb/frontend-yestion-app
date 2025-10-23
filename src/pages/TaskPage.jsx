import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import styles from '../styles/TaskPage.module.css'; 
import TaskCard from '../components/taskCard';
import NewTaskProject from '../components/NewTaskProject';
import ConfirmationModal from '../components/ConfirmDelete';
import DescriptionModal from '../components/DescriptionModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const API_URL = "https://api-yestion.farelfebryan.my.id";

const TaskPage = () => {
  const { projectId } = useParams();
  const { setSearchCallback } = useOutletContext();
  const [project, setProject] = useState(null); 
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState(null);
const handleSearch = React.useCallback((searchTerm) => {
      setSearchTerm(searchTerm);
      
      if (!searchTerm || !searchTerm.trim()) {
        setFilteredTasks(tasks);
        return;
      }
  
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = tasks.filter(task => {
        const title = (task?.title || '').toLowerCase();
        const description = (task?.description || '').toLowerCase();
        const projectName = (task?.project?.name || '').toLowerCase();
        
        return title.includes(searchLower) || 
               description.includes(searchLower) || 
               projectName.includes(searchLower);
      });
      
      console.log('Search term:', searchTerm);
      console.log('Total tasks:', tasks.length);
      console.log('Filtered tasks:', filtered.length);
      
      setFilteredTasks(filtered);
    }, [tasks]);
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      setIsLoading(true);
      try {
        const projectResponse = await axios.get(`${API_URL}/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        console.log("Project data:", projectResponse.data);
        setProject(projectResponse.data);

        const tasksResponse = await axios.get(`${API_URL}/api/tasks`, {
          params: { project_id: projectId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        console.log("Tasks data:", tasksResponse.data);
        
        let rawTasks = tasksResponse.data;
        if (rawTasks && rawTasks.tasks) rawTasks = rawTasks.tasks;
        if (rawTasks && rawTasks.data) rawTasks = rawTasks.data;
        if (!Array.isArray(rawTasks)) {
          console.warn('Unexpected tasks response shape:', rawTasks);
          rawTasks = [];
        }

        setTasks(rawTasks.map(task => ({
          ...task,
          id: task.id || task.task_id,
          status_id: task.status_id || task.status || 1
        })));

      } catch (error) {
        console.error("Fetch failed:", error);
        toast.error(error.response?.status === 404 ? 'Project tidak ditemukan' : 'Gagal memuat data');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectAndTasks();
    } else {
      setIsLoading(false);
      toast.error('Project ID tidak valid');
    }
  }, [projectId]);

  useEffect(() => {
      setSearchCallback(() => handleSearch);
      return () => setSearchCallback(null);
    }, [setSearchCallback, handleSearch]);

  /*'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|integer|exists:projects,id',
            'status_id' => 'required|integer|exists:status,id',
            'priority_id' => 'nullable|integer|exists:priority,id',
            'due_date' => 'nullable|date', */

  const handleTaskSubmit = async (taskData) => {
    const apiData = {
      title: taskData.name,
      description: taskData.description,
      project_id: projectId,
      status_id: taskToEdit ? taskToEdit.status_id : 1,
      priority_id: (taskData.priority ? parseInt(taskData.priority) : null) || null,
      due_date: taskData.dueDate || null,
    };

    try {
      let response;
      if (taskToEdit) {
        response = await axios.put(
          `${API_URL}/api/tasks/${taskToEdit.id}`,
          apiData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        setTasks(currentTasks =>
          currentTasks.map(task =>
            task.id === taskToEdit.id ? response.data : task
          )
        );
        toast.success('Task updated successfully');
      } else {
        response = await axios.post(
          `${API_URL}/api/tasks`,
          apiData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        setTasks(currentTasks => [response.data, ...currentTasks]);
        toast.success('Task created successfully');
      }
      
      setIsModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error(taskToEdit ? "Failed to update task:" : "Failed to create task:", error);
      toast.error(taskToEdit ? "Failed to update task" : "Failed to create task");
    }
  };

const handleUpdateTaskStatus = async (taskId, currentStatusId) => {
    const newStatusId = (currentStatusId == 1) ? 2 : 3; 
    if (currentStatusId >= 3) return;

    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, status_id: newStatusId } : task
      )
    );

    try {
      const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, 
        { 
          status_id: newStatusId,
          project_id: projectId  
        },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } }
      );

      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === taskId ? response.data : task
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status, reverting...");
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === taskId ? { ...task, status_id: currentStatusId } : task
        )
      );
    }
  };


  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      setTaskToDelete(taskToDelete);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setTasks(currentTasks => currentTasks.filter(t => t.id !== taskToDelete.id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };
  
  const renderColumnContent = (taskList) => {
    const filteredTasks = taskList.filter(task => {
      if (!searchTerm || searchTerm.trim() === '') {
        return true;
      }

      const searchTermLower = searchTerm.toLowerCase().trim();
      const title = (task?.title || '').toLowerCase().trim();
      const description = (task?.description || '').toLowerCase().trim();
      
      console.log('Searching for:', searchTermLower);
      console.log('Task title:', title);
      console.log('Task description:', description);
      console.log('Match result:', {
        titleMatch: title.includes(searchTermLower),
        descriptionMatch: description.includes(searchTermLower)
      });
      
      if (title === searchTermLower || description === searchTermLower) {
        return true;
      }
      
      return title.includes(searchTermLower) || description.includes(searchTermLower);
    });

    if (isLoading && tasks.length === 0) { 
      return <p className={styles.emptyMessage}>Loading tasks...</p>;
    }
    if (taskList.length === 0) {
      return <p className={styles.emptyMessage}>Nothing to do right now</p>;
    }
    if (filteredTasks.length === 0) {
      return <p className={styles.emptyMessage}>No matching tasks found</p>;
    }
    return filteredTasks.map(task => (
        <TaskCard 
        key={task.id} 
        task={task}
        variant="project"
        onUpdateStatus={handleUpdateTaskStatus}
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setTaskToEdit(task);
          setIsModalOpen(true);
        }}
        onDescriptionClick={(task) => setSelectedTaskDescription(task)}
      />
    ));
  };


  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingState}>
          <p className={styles.emptyMessage}>Loading projects...</p>
        </div>
      </main>
    );
  }


  return (
    <main className={styles.container}>
      
      <header className={styles.header}>
        <h1 className={styles.title}>{project.name}</h1>
        <button 
          className={styles.newTaskButton}
          onClick={() => setIsModalOpen(true)}
        >
          New task +
        </button>
      </header>

      <div className={styles.boardContainer}>
        <div className={`${styles.column} ${styles.notComplete}`}>
          <h2 className={styles.columnTitle}>Not Complete</h2>
          <div className={styles.tasksContainer}>
            {renderColumnContent(tasks.filter(t => Number(t.status_id) === 1))}
          </div>
        </div>
        <div className={`${styles.column} ${styles.onGoing}`}>
          <h2 className={styles.columnTitle}>On-Going</h2>
          <div className={styles.tasksContainer}>
            {renderColumnContent(tasks.filter(t => Number(t.status_id) === 2))}
          </div>
        </div>
        <div className={`${styles.column} ${styles.completed}`}>
          <h2 className={styles.columnTitle}>Completed</h2>
          <div className={styles.tasksContainer}>
            {renderColumnContent(tasks.filter(t => Number(t.status_id) === 3))}
          </div>
        </div>
      </div>
      
      <NewTaskProject
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleTaskSubmit}
        initialData={taskToEdit ? {
          name: taskToEdit.title,
          description: taskToEdit.description,
          dueDate: taskToEdit.due_date,
          priority: taskToEdit.priority?.id || taskToEdit.priority_id
        } : undefined}
      />
      
      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
      />

      <DescriptionModal
        isOpen={selectedTaskDescription !== null}
        onClose={() => setSelectedTaskDescription(null)}
        description={selectedTaskDescription?.description}
        title={selectedTaskDescription?.title}
      />
    </main>
  );
};

export default TaskPage;