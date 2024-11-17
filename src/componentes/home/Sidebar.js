import React, { useState, useEffect } from 'react';
import './sidebar.css';
import AddButton from '../button/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Sidebar = ({ showForm, onToggleForm, onToggleSignUp, onBoardSelect }) => {
  const { workspace } = useWorkspace();
  const [showBoards, setShowBoards] = useState(false);
  const [boards, setBoards] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal

  const navigate = useNavigate(); // Usar useNavigate para la redirección

  // Función para manejar la visualización de tableros
  const handleShowBoards = () => {
    setShowBoards((prev) => !prev);
  };

  const handleDeactivate = async () => {
    // Verifica si el usuario actual es el propietario del workspace
    if (user && workspace.owner && user.id === workspace.owner.id) {
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
      // Si el usuario no es el propietario, mostrar el mensaje correspondiente
      setModalMessage('Solo el owner puede desactivar un workspace');
      setShowModal(true);
    }
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

      {/* Botón de usuario */}
      <div className="user-buttons-container">
        <button className="user-button" onClick={onToggleSignUp}>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
        </button>
        <button className="deactivate-button" onClick={handleDeactivate}>
          <FontAwesomeIcon icon={faPowerOff} className="deactivate-icon" />
        </button>
      </div>

      {/* Modal de error o éxito */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalMessage}</h2>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
