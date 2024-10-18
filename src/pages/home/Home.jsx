import React, { useState } from 'react';
import './styles/home.css';
import Sidebar from '../../componentes/home/Sidebar';
import AddBoardForm from '../../componentes/forms/AddBoardForm';
import Board from '../../componentes/home/Board';

const Home = ({user}) => {
  const [showForm, setShowForm] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null); 

  const handleAddBoard = (newBoard) => {
    setCurrentBoard(newBoard); // Actualizar con el nuevo board
    setShowForm(false); // Cerrar el formulario
  };

  const toggleFormVisibility = () => setShowForm(!showForm);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 sidebar"> 
          <Sidebar showForm={showForm} onToggleForm={toggleFormVisibility} />
        </div>

        <div className={`col-md-10 board-area ${currentBoard ? 'board-color' : ''}`}>
          {currentBoard === null ? (
            <div className="empty-board-area"></div>
          ) : (
            <div className="board-title">
                <span className='board-header'>{currentBoard.name}</span> {/* Título del tablero */}
              <Board {...currentBoard} /> {/* Componente Board */}
            </div>
          )}

          {showForm && (
            <div className="add-board-form-container">
              <AddBoardForm onAddBoard={handleAddBoard} onClose={toggleFormVisibility} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
