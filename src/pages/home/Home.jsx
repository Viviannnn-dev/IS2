import React, { useState } from 'react';
import './styles/home.css';
import Sidebar from '../../componentes/home/Sidebar';
import AddBoardForm from '../../componentes/forms/AddBoardForm';
import Board from '../../componentes/home/Board';

const Home = ({user}) => {
  const [showForm, setShowForm] = useState(false);
  const [boards, setBoards] = useState([]);

  const handleAddBoard = (newBoard) => {
    setBoards([...boards, newBoard]);
    setShowForm(false);
  };

  const toggleFormVisibility = () => setShowForm(!showForm);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 sidebar"> 
          <Sidebar showForm={showForm} onToggleForm={toggleFormVisibility} />
        </div>

        <div className={`col-md-10 board-area ${boards.length > 0 ? 'board-color' : ''}`}>
          {boards.length === 0 ? (
            <div className="empty-board-area"></div>
          ) : (
            boards.map((board, index) => (
              <div key={index} className="board-title">
                  <span className='board-header'>{board.name}</span> {/* Título del tablero */}
                <Board {...board} /> {/* Componente Board */}
              </div>
            ))
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
