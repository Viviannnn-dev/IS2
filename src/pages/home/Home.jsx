import React, { useState } from 'react';
import './styles/home.css';
import Sidebar from '../../componentes/home/Sidebar';
import AddBoardForm from '../../componentes/forms/AddBoardForm';
import Board from '../../componentes/home/Board';
import SignUpForm from '../../componentes/forms/SignUpForm';

const Home = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false); // Estado para el modal de registro
  const [currentBoard, setCurrentBoard] = useState(null); 

  const handleAddBoard = (newBoard) => {
    setCurrentBoard(newBoard); // Actualizar con el nuevo board
    setShowForm(false); // Cerrar el formulario
  };

  const handleBoardSelect = (board) => {
    setCurrentBoard(board); // Actualizar con el tablero seleccionado
  };


  const toggleFormVisibility = () => setShowForm(!showForm);

  // Función para alternar la visibilidad del modal de registro
  const toggleSignUpVisibility = () => setShowSignUp(!showSignUp);

  // Función para manejar el registro
  const handleSignUp = async (username, password) => {
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email:'' }), // Datos del registro
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Usuario registrado con éxito');
        setShowSignUp(false); // Cierra el modal de registro después del éxito
      } else {
        console.error('Error al registrar usuario', data);
      }
    } catch (error) {
      console.error("Error en la solicitud de registro", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 sidebar"> 
          <Sidebar showForm={showForm} onToggleForm={toggleFormVisibility} onToggleSignUp={toggleSignUpVisibility} onBoardSelect={handleBoardSelect} />
        </div>

        <div className={`col-md-10 board-area ${currentBoard ? 'board-color' : ''}`}>
          {currentBoard === null ? (
            <div className="empty-board-area"></div>
          ) : (
            <div className="board-title">
                <span className='board-header'>{currentBoard.name}</span>
              <Board {...currentBoard} />
            </div>
          )}

          {showForm && (
            <div className="add-board-form-container">
              <AddBoardForm onAddBoard={handleAddBoard} onClose={toggleFormVisibility} />
            </div>
          )}

          {showSignUp && (
            <div className="sign-up-form-container">
              <SignUpForm onSignUp={handleSignUp} onClose={toggleSignUpVisibility} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;



