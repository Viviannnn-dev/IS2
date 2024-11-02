import React, { useState, useEffect } from 'react'; 
import './styles/home.css';
import Sidebar from '../../componentes/home/Sidebar';
import AddBoardForm from '../../componentes/forms/AddBoardForm';
import Board from '../../componentes/home/Board';
import SignUpForm from '../../componentes/forms/SignUpForm';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const users = location.state?.users;
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [showForm, setShowForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Estado para detectar búsquedas

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const yesterday = new Date();
  yesterday.setHours(0,0, 0, 0, 0);
  yesterday.setDate(currentDate.getDate() - 1);
  function areDatesEqual(date1, date2) {
      console.log(date1);
      console.log(date2);
      return date1.toDateString() === date2.toDateString();
  }

  const colorMapping = {
    '#ffb3d9': 1,
    '#add8e6': 2,
    '#b2e2b2': 3,
    '#ffcc99': 4,
  };

  const fetchTasks = async (board_id, user_id = null) => {
    // Evita la petición si ambos filtros están en "-1" o vacíos
    if (selectedUser === "-1" || selectedLabel === "-1") {
      setTasks([]); // Resetea las tareas a un array vacío
      setHasSearched(false);
      return;
    }
  
    try {
      const baseURL = user_id 
        ? `http://localhost:8000/api/board/${board_id}/users/${user_id}/tasks/` 
        : `http://localhost:8000/api/board/${board_id}/tasks/`;
  
      const url = selectedLabel 
        ? `${baseURL}?label=${colorMapping[selectedLabel]}`
        : baseURL;
  
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setTasks(data);
        setHasSearched(true);
      } else {
        console.error("Error al obtener tareas:", data);
      }
    } catch (error) {
      console.error("Error en la solicitud de tareas", error);
    }
  };
  

  useEffect(() => {
    if (currentBoard) {
      fetchTasks(currentBoard.id, selectedUser || null);
    }
  }, [currentBoard, selectedUser,selectedLabel]);

  const handleLabelFilterChange = (e) => {
    setSelectedLabel(e.target.value);
  };

  const handleAddBoard = (newBoard) => {
    setCurrentBoard(newBoard);
    setShowForm(false);
  };

  const handleUserFilterChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleBoardSelect = (board) => {
    setCurrentBoard(board);
  };
  

  const toggleFormVisibility = () => setShowForm(!showForm);
  const toggleSignUpVisibility = () => setShowSignUp(!showSignUp);

  const handleSignUp = async (username, password) => {
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email: '' }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowSignUp(false);
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
              <span className='board-header'>{currentBoard.name}    
                <div className="filter-options">
                  <label>
                    Filtrar por usuario:
                    <select onChange={handleUserFilterChange}>
                    <option value="-1"></option>
                      <option value="">Todos</option>
                      {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Filtrar por etiqueta:
                    <select
                      value={selectedLabel}
                      onChange={handleLabelFilterChange}
                      style={{ backgroundColor: selectedLabel && selectedLabel !== '-1' ? selectedLabel : 'white' }}
                      >
                       <option value="-1" className="empty-option"></option> 
                       <option value="" className="empty-option">Todas</option>
                      {Object.keys(colorMapping).map((color) => (
                        <option key={color} value={color} style={{ backgroundColor: color }}>
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </span>
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

          {/* Muestra las tareas debajo del componente Board */}
          <div className="task-home">
                <div className="task-list">
                    {tasks.length === 0 && hasSearched ? (
                        <p>No existen tareas.</p>
                    ) : (
                        tasks.map((task, index) => {

                            // Convertir la fecha de vencimiento a un objeto Date
                            const [year, month, day] = task.due_date.split('-').map(Number);
                            const dueDate = new Date(year, month - 1, day); // Crea la fecha en medianoche local
                            

                            console.log(task.due_date)


                            // Determinar la clase según la fecha de vencimiento
                            let taskClass = 'task-item'; // Clase base

                            // Asignar la clase "atrasada" o "vencido"
                            if ( areDatesEqual(dueDate, currentDate) || areDatesEqual(dueDate,yesterday)) {
                                taskClass = 'late'; // Si la fecha es hoy o ayer
                            } else if(dueDate<currentDate){
                                taskClass= 'defeated';
                            }

                            return (
                                <div key={index} className={taskClass}>
                                    <p>Nombre: {task.name}</p>
                                    <p>Descripción: {task.description}</p>
                                    <p>Estado: {task.status}</p>
                                    <p>Fecha de Vencimiento: {task.due_date}</p>
                                </div>
                            );
                        })
                    )}
                </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
