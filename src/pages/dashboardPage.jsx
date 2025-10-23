import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboardPage.module.css'; 
import { toast } from 'react-toastify';
import TaskCard from '../components/taskCard';
import NewTask from '../components/NewTask';
import axios from 'axios';
import ConfirmationModal from '../components/ConfirmDelete';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

const greetings = [
  "Let's make today productive",
  "Hello! What's your main focus for today?",
  "Let's get started. What's first on the list?",
  "Here is your overview for today.",
  "Ready to tackle your tasks?",
  "Seize the day! What's the plan?"
];

const getRandomGreeting = () => {
  return greetings[Math.floor(Math.random() * greetings.length)];
};

const API_URL = "https://api-yestion.farelfebryan.my.id";


const DashboardPage = () => {
  const navigate = useNavigate();
  const { setSearchCallback } = useOutletContext();
  const [greeting, setGreeting] = useState(getRandomGreeting());
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [projects, setProjects] = useState([]); 
  const [taskToDelete, setTaskToDelete] = useState(null);

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

      setTasks(currentTasks => 
        currentTasks.filter(t => t.id !== taskToDelete.id)
      );
      
      setFilteredTasks(currentFilteredTasks => 
        currentFilteredTasks.filter(t => t.id !== taskToDelete.id)
      );
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };
  
  useEffect(() => {
    setSearchCallback(() => handleSearch);
    return () => setSearchCallback(null);
  }, [setSearchCallback, handleSearch]);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
    
      try {
        const response = await axios.get(`${API_URL}/api/tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        // console.log('Raw API response:', response.data);
        
        let taskData = response.data;
        if (taskData && taskData.tasks) taskData = taskData.tasks;
        if (taskData && taskData.data) taskData = taskData.data;
        
        const normalizedTasks = Array.isArray(taskData) ? taskData.map(task => ({
          ...task,
          id: task.id || task.task_id,
          status_id: task.status_id || task.status || 1
        })) : [];

        console.log('Normalized tasks:', normalizedTasks);

        setTasks(normalizedTasks);
        setFilteredTasks(normalizedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        console.error("Error details:", error.response || error);
        setTasks([]);
        setFilteredTasks([]);
        toast.error('Failed to load tasks. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);


  // useEffect(() => {
  //   console.log('Tasks state updated:', tasks);
  //   console.log('Filtered tasks state updated:', filteredTasks);
  // }, [tasks, filteredTasks]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        let projectData = response.data;
        if (projectData && projectData.data) projectData = projectData.data;
        setProjects(Array.isArray(projectData) ? projectData : []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('Failed to load projects');
      }
    };

    fetchProjects();
  }, []);

/*  
{
    "title": "First Task Test",
    "description": "nyoba bikin task",
    "project_id": "6",
    "status_id": "1",
    "priority_id": "2",
    "due_date": "2025-10-10",*/
  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, taskData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const newTask = response.data;
      setTasks(currentTasks => [newTask, ...currentTasks]);
      setFilteredTasks(currentTasks => [newTask, ...currentTasks]);
      
      toast.success('Task created successfully!');
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  };

  const renderColumnContent = (taskList) => {
    if (isLoading && tasks.length === 0) {
      return <p className={styles.emptyMessage}>Loading tasks...</p>;
    }
    
    if (!taskList || taskList.length === 0) {
      if (searchTerm) {
        return <p className={styles.emptyMessage}>No tasks match your search</p>;
      }
      return <p className={styles.emptyMessage}>Nothing to do right now</p>;
    }

    return taskList.map(task => (
      <div 
        key={task.id} 
        onClick={() => navigate(`/projects/${task.project_id}`)}
        style={{ cursor: 'pointer' }}
      >
        <TaskCard 
          task={task}
          variant="simple"
          onDelete={handleDeleteTask}
          onEdit={(task) => {
          setTaskToEdit(task);
          setIsTaskModalOpen(true);
        }} 
        />
      </div>
    ));
  };


  return (
    <>
      <main className={styles.dashboardContainer}>
        
        <header className={styles.header}>
          <h1 className={styles.title}>{greeting}</h1>
          <button 
            className={styles.newTaskButton}
            onClick={() => setIsTaskModalOpen(true)}
          >
            New task +
          </button>
        </header>

        <div className={styles.boardContainer}>
          <div className={`${styles.column} ${styles.notComplete}`}>
            <h2 className={styles.columnTitle}>Not Complete</h2>
            <div className={styles.tasksContainer}>
              {renderColumnContent(filteredTasks.filter(t => Number(t.status_id) === 1))}
            </div>
          </div>
          <div className={`${styles.column} ${styles.onGoing}`}>
            <h2 className={styles.columnTitle}>On-Going</h2>
            <div className={styles.tasksContainer}>
              {renderColumnContent(filteredTasks.filter(t => Number(t.status_id) === 2))}
            </div>
          </div>
          <div className={`${styles.column} ${styles.completed}`}>
            <h2 className={styles.columnTitle}>Completed</h2>
            <div className={styles.tasksContainer}>
              {renderColumnContent(filteredTasks.filter(t => Number(t.status_id) === 3))}
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
      />

      <NewTask 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
      />
    </>
  );
};

export default DashboardPage;