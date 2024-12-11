import React, { useState, useEffect } from 'react';
import './sidebar.css';
import { Modal } from 'react-bootstrap'; // Importar Modal de react-bootstrap
import AddButton from '../button/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWorkspace } from '../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { faUser, faPowerOff, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const Sidebar = ({ showForm, onToggleForm, onToggleSignUp, onBoardSelect }) => {
  const { workspace } = useWorkspace();
  const { setWorkspace } = useWorkspace();
  const [showBoards, setShowBoards] = useState(false);
  const [boards, setBoards] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
  const [users, setUsers] = useState([]);

  const navigate = useNavigate(); // Usar useNavigate para la redirección

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/`)
    .then(response => {
        // Filtrar al usuario autenticado para que no se muestre en la lista
        const filteredUsers = response.data.filter(u => u.id !== user.id);
        setUsers(filteredUsers);
      })
            .catch(error => console.error('Error al obtener usuarios:', error));
      }, []);

  console.log("users",users);
  // Función para manejar la visualización de tableros
  const handleShowBoards = () => {
    setShowBoards((prev) => !prev);
  };

  const handleDeactivate = async () => {
    console.log("PARA DESACTIVAR");
    console.log("USUARIO ID",user.id);
    console.log("OWNER ID",workspace.owner);
    // Verifica si el usuario actual es el propietario del workspace
    if (user && workspace.owner &&  user.id === workspace.owner) {
      try {
        const response = await fetch(`http://localhost:8000/api/workspace-update/${workspace.id}/`, {
          method: 'PUT', // O 'PATCH', según lo que necesites
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'inactive', // Establecer el estado como inactivo
          }),
        });

        if (!response.ok) {
          throw new Error('Error al desactivar el workspace');
        }

        const data = await response.json();
        console.log('Workspace desactivado:', data);
        // Mostrar el modal con el mensaje de éxito
        setModalMessage('Workspace Desactivado');
        setShowModal(true);

      } catch (error) {
        console.error('Error al desactivar el workspace:', error);
        // Mostrar el modal con mensaje de error
        setModalMessage('Ocurrió un error inesperado');
        setShowModal(true);
      }
    } else {
      console.log("Solo el owner puede desactivar un workspace");
      // Si el usuario no es el propietario, mostrar el mensaje correspondiente
      setModalMessage('Solo el owner puede desactivar un workspace');
      setShowModal(true);
    }
  };

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: workspace?.name || '',
    users: workspace?.users || [],
  });

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  
  const handleEditUserSelect = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
    setEditFormData({ ...editFormData, users: selectedUsers });
  };
  
  // Función para obtener los tableros del workspace
  const fetchBoards = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/workspaces/${workspace.id}/boards/`);
      if (!response.ok) {
        throw new Error('Error al obtener los tableros');
      }
      const data = await response.json();
      setBoards(data); // Asumimos que la respuesta contiene un array de tableros
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  useEffect(() => {
    if (showBoards) {
      fetchBoards(); // Cargar tableros solo cuando se muestra la lista
    }
  }, [showBoards]);

  const handleBoardClick = (board) => {
    onBoardSelect(board); // Llamar la función proporcionada por el componente padre
  };

  // Función para cerrar el modal y redirigir
  const closeModal = () => {
    setShowModal(false);
    if (modalMessage === 'Workspace Desactivado') {
      // Redirigir a /workspace después de desactivar el workspace
      navigate('/workspace');
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/workspace-update/${workspace.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el workspace');
      }
  
      const updatedWorkspace = await response.json();
      setWorkspace(updatedWorkspace);
      setShowEditModal(false);
      setModalMessage('Workspace Actualizado');
      setShowModal(true);
    } catch (error) {
      console.error('Error al actualizar el workspace:', error);
      setModalMessage('Error al actualizar el workspace');
      setShowModal(true);
    }
  };
  

  return (
    <div className="sidebar">
      <div className="add-board">
        <span className="board-label">Tablero</span>
        <AddButton onClick={onToggleForm} />
      </div>
      {/* Botón para listar tableros */}
      <button className="button-task" onClick={handleShowBoards}>
        <strong style={{ color: '#fff' }}>{showBoards ? 'Ocultar Tableros' : 'Listar Tableros'}</strong>
      </button>
      {/* Mostrar la lista de tableros */}
      {showBoards && (
        <div className="task-list-sidebar">
          {boards.length === 0 ? (
            <p>No existen tableros.</p>
          ) : (
            boards.map((board) => (
              <li key={board.id} onClick={() => handleBoardClick(board)} style={{ listStyleType: 'none' }}>
                <button className="board-button">{board.name}</button>
              </li>
            ))
          )}
        </div>
      )}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Editar Workspace</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form onSubmit={handleUpdateWorkspace}>
      <div className="form-group mb-3">
        <label className="form-label">Nombre del Workspace:</label>
        <input
          type="text"
          name="name"
          className="form-control rounded"
          value={editFormData.name}
          onChange={handleEditInputChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Usuarios Asociados:</label>
        <select
          name="users"
          className="form-control rounded"
          multiple
          value={editFormData.users}
          onChange={handleEditUserSelect}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  </Modal.Body>
</Modal>



      {/* Botón de usuario */}
      <div className="user-buttons-container">
        <button className="user-button" onClick={onToggleSignUp}>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
        </button>
        <button className="edit-button" onClick={() => setShowEditModal(true)}>
          <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" />
        </button>
        <button className="deactivate-button" onClick={handleDeactivate}>
          <FontAwesomeIcon icon={faPowerOff} className="deactivate-icon" />
        </button>
      </div>

      {/* Modal de error o éxito */}
      <Modal show={showModal} onHide={closeModal} dialogClassName="custom-modal">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>{}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom modal-sidebar ">
          <p>{modalMessage}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Sidebar;
