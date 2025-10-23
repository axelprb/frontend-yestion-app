import React, { useEffect } from 'react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from '../styles/ProjectPage.module.css';
import ProjectCard from '../components/ProjectCard';
import NewProject from '../components/NewProject';
import ConfirmDelete from '../components/ConfirmDelete';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = "https://api-yestion.farelfebryan.my.id";

const ProjectPage = () => {
  const { setSearchCallback } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      setIsLoading(true);
      try {
        const projectsResponse = await axios.get(`${API_URL}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
          }
        });
        
        let projectsData = projectsResponse.data;
        const projectsWithTasks = await Promise.all(projectsData.map(async (project) => {
          try {
            const tasksResponse = await axios.get(`${API_URL}/api/tasks`, {
              params: { project_id: project.id },
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            });

            let rawTasks = tasksResponse.data;
            if (rawTasks && rawTasks.tasks) rawTasks = rawTasks.tasks;
            if (rawTasks && rawTasks.data) rawTasks = rawTasks.data;

            return {
              ...project,
              tasks: rawTasks.map(task => ({
                ...task,
                id: task.id || task.task_id,
                status_id: task.status_id || task.status || 1
              }))
            };
          } catch (error) {
            // console.error(`Failed to fetch tasks for project ${project.id}:`, error);
            return {
              ...project,
              tasks: []
            };
          }
        }));

        // console.log("Projects with tasks:", projectsWithTasks);
        setProjects(projectsWithTasks);
        setFilteredProjects(projectsWithTasks);
      } catch (error) {
        // console.error("Fetch projects failed:", error);
        toast.error("Failed to load projects");
        setProjects([]); 
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectsAndTasks();
  }, []); 

  useEffect(() => {
    const handleSearch = (term) => {
      setSearchTerm(term);
      
      if (!term || !term.trim()) {
        setFilteredProjects(projects);
        return;
      }

      const searchLower = term.toLowerCase().trim();
      const filtered = projects.filter(project => {
        const name = (project.name || '').toLowerCase();
        const taskTitles = project.tasks.map(task => (task.title || '').toLowerCase());
        const taskDescriptions = project.tasks.map(task => (task.description || '').toLowerCase());
        
        return name.includes(searchLower) || 
               taskTitles.some(title => title.includes(searchLower)) ||
               taskDescriptions.some(desc => desc.includes(searchLower));
      });
      
      setFilteredProjects(filtered);
    };

    setSearchCallback(handleSearch);
    return () => setSearchCallback(null);
  }, [setSearchCallback, projects]);

  const handleCreateProject = async (projectName) => {
    
    const apiData = {
      name: projectName,
    }
    try {
   
      const response = await axios.post(`${API_URL}/api/projects`, apiData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const newProject = response.data.project || response.data.data || response.data; 
      setProjects(prevProjects => [newProject, ...prevProjects]);
      toast.success(`Project "${newProject.name}" created!`);
      setIsModalOpen(false);
    } catch (error) {
      // console.error("Error create project:", error);
      if (error.response.status === 422) {
        toast.error(`Project "${projectName}" already exists!`);
      }
    }
    setIsModalOpen(false);
  };
  const handleDeleteRequest = (projectId) => {
    setProjectToDeleteId(projectId); 
    setIsConfirmModalOpen(true);
  };
  const executeDelete = async () => {
    if (!projectToDeleteId) return; 

    try {
      await axios.delete(`${API_URL}/api/projects/${projectToDeleteId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      setProjects(currentProjects => 
        currentProjects.filter(p => p.id !== projectToDeleteId)
      );
      

    } catch (error) {
      // console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsConfirmModalOpen(false);
      setProjectToDeleteId(null);
    }
  };
  const projectToDelete = projects.find(p => p.id === projectToDeleteId);
  const confirmMessage = projectToDelete 
    ? `Are you sure you want to delete project "${projectToDelete.name}"? This action cannot be undone.`
    : "Are you sure you want to delete this project?";
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <button 
          className={styles.newProjectButton}
          onClick={() => setIsModalOpen(true)} 
        >
          New Project +
        </button>
      </header>

      {isLoading ? (
        <p>Loading projects...</p> 
      ) : (
        <div className={styles.projectGrid}>
          {filteredProjects.length === 0 ? (
            <p>{searchTerm ? 'No matching projects found.' : 'No projects found.'}</p> 
          ) : (
            filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={handleDeleteRequest} 
              /> 
            ))
          )}
        </div>
      )}

      <NewProject 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      <ConfirmDelete
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)} 
        onConfirm={executeDelete} 
        title="Delete Project"
        message={confirmMessage} 
      />
    </div>
  );
};

export default ProjectPage;