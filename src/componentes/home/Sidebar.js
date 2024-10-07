// Sidebar.jsx
import React from 'react';
import './sidebar.css';
import AddButton from '../button/AddButton';

const Sidebar = ({ showForm, onToggleForm }) => {
  return (
    <div className="sidebar">
      <div className="add-board">
        <span className="board-label">Tablero</span>
        {/* Usa onToggleForm en lugar de manejar el estado local */}
        <AddButton onClick={onToggleForm} />
      </div>
    </div>
  );
};

export default Sidebar;
