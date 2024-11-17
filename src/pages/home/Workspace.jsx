import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWorkspace } from '../../componentes/context/WorkspaceContext';

import './styles/workspace.css';

function Workspace({}) {
  const [workspaces, setWorkspaces] = useState([]);
  const { setWorkspace } = useWorkspace();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    users: []
  });
  const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem('user'));
console.log(user.username);  // Ejemplo de acceso a los datos del usuario

  // Obtener los workspaces del usuario autenticado
  useEffect(() => {
    if (user.id) {
    console.log('USER',user.id);  // Ejemplo de acceso a los datos del usuario

      axios.get(`http://localhost:8000/api/workspace/`, { params: { user_id: user.id } })
        .then(response => setWorkspaces(response.data))
        .catch(error => console.error('Error al obtener workspaces:', error));
    }
  }, [user.id]);

  // Obtener todos los usuarios para el selector
  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/`)
.then(response => {
    // Filtrar al usuario autenticado para que no se muestre en la lista
    const filteredUsers = response.data.filter(u => u.id !== user.id);
    setUsers(filteredUsers);
  })
        .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  // Manejar el formulario para crear un nuevo workspace
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUserSelect = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, users: selectedUsers });
  };

 const handleCreateWorkspace = (e) => {
    e.preventDefault();
    // Asignar el usuario autenticado como el owner del workspace
    const workspaceData = { 
      ...formData, 
      owner: user.id 
    };

    axios.post(`http://localhost:8000/api/save_workspace/`, workspaceData)
      .then(response => {
        setWorkspace(response.data);
        navigate('/home', { state: { users } });  // Aquí pasas `users` a `Home`
      })
      .catch(error => console.error('Error al crear workspace:', error));
  };
  // Función para redirigir al Home con los datos del Workspace seleccionado
  const handleWorkspaceClick = (workspace) => {
    setWorkspace(workspace);
    console.log(workspace);
    navigate('/home', { state: { users } });  // Aquí pasas `user` a `Home`
  };

  return (
    <div className='workspace-base'>
      <h1 className='workspace-title'>Workspace</h1>
      <div className='workspace-content'>
        {/* Columna izquierda: Lista de Workspaces */}
        <div className='workspace-list'>
          <h2>Existentes</h2>
          {workspaces.map(workspace => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceClick(workspace)}
              className='workspace-button'
            >
              {workspace.name}
            </button>
          ))}
        </div>

   {/* Columna derecha: Formulario para Crear Nuevo Workspace */}
<div className='workspace-form'>
  <h2>Crear Nuevo</h2>
  <form onSubmit={handleCreateWorkspace}>
    <div className='form-group'>
      <label>Nombre:</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
    </div>
    <div className='form-group'>
      <label>Descripción:</label>
      <textarea name="description" value={formData.description} onChange={handleInputChange} required />
    </div>
    <div className='form-group'>
      <label>Usuarios Asociados:</label>
      <select name="users" multiple onChange={handleUserSelect}>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
    </div>
    <div className='button-container'> {/* Nueva clase para el botón */}
        <button type="submit">Crear Workspace</button>
    </div> 
     </form>
</div>



      </div>
    </div>
  );
}

export default Workspace;
