import React, { useState, useEffect } from 'react';
import './sidebar.css';
import AddButton from '../button/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useWorkspace } from '../context/WorkspaceContext';

const Sidebar = ({ showForm, onToggleForm, onToggleSignUp }) => {
  const { workspace } = useWorkspace();
  const [showBoards, setShowBoards] = useState(false);
  const [boards, setBoards] = useState([]);

  // Función para manejar la visualización de tableros
  const handleShowBoards = () => {
    setShowBoards((prev) => !prev);
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
        <div className="task-list">
          {boards.length === 0 ? (
            <p>No existen tableros.</p>
          ) : (
            boards.map((board) => (
              <button key={board.id} className="board-button">
                {board.name}
              </button>
            ))
          )}
        </div>
      )}
      {/* Botón de usuario */}
      <button className="user-button" onClick={onToggleSignUp}>
        <FontAwesomeIcon icon={faUser} className="user-icon" />
      </button>
    </div>
  );
};

export default Sidebar;
