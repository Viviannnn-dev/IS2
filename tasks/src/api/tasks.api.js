import React, { useState, useEffect } from "react";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/tasks/?project=${projectId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} onClick={() => fetchTasks(project.id)}>
            {project.name}
          </li>
        ))}
      </ul>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
