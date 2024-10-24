import React from 'react';
import './sidebar.css';
import AddButton from '../button/AddButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ showForm, onToggleForm,  onToggleSignUp }) => {
  return (
    <div className="sidebar">
      <div className="add-board">
        <span className="board-label">Tablero</span>
        <AddButton onClick={onToggleForm} />
      </div>
      {/* Botón de usuario */}
      <button className="user-button" onClick={onToggleSignUp}>
        <FontAwesomeIcon icon={faUser} className="user-icon" />
      </button>
    </div>
  );
};

export default Sidebar;
