import React, { useState, useRef } from 'react';
import List from './List';
import './board.css';
import AddButton from '../button/AddButton';

const Board = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);
  const listsContainerRef = useRef(null);

  // Agregar una nueva lista
  const addList = () => {
    if (newListName) {
      setLists([{ name: newListName, cards: [] }, ...lists]);
      setNewListName('');
      setShowAddButton(false);
    }
  };

  // Manejar el cambio en el input de la nueva lista
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewListName(value);
    validateAddButton(value, newLimit);
  };

  const handleInputChange2 = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setNewLimit(value);
      validateAddButton(newListName, value);
    }
  };

  const validateAddButton = (listName, limit) => {
    setShowAddButton(listName.trim() !== '' && limit.trim() !== '');
  };

  // Hacer scroll al inicio del contenedor
 

  // Función para añadir una tarjeta a una lista específica
  const addCardToList = (listIndex, cardName) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].cards.push(cardName); // Añadir tarjeta a la lista correspondiente
    setLists(updatedLists); // Actualizar el estado
  };

  const renameList = (listIndex, newName) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].name = newName; // Actualizar el nombre de la lista
    setLists(updatedLists); // Guardar el nuevo estado
  };

  const deleteList = (listIndex) => {
    const updatedLists = lists.filter((_, index) => index !== listIndex);
    setLists(updatedLists);
  };

  console.log(showAddButton);
  return (
    <div className="board">
      <div className="lists-container" ref={listsContainerRef}>
        <div className="lists">
          {lists.map((list, index) => (
            <List key={index} list={list} listIndex={index} onAddCard={addCardToList} onRenameList={renameList} onDeleteList={deleteList}/>
          ))}
          <div className="add-list-container">
            <form onSubmit={addList} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <input
                type="text"
                value={newListName}
                onChange={handleInputChange}
                placeholder="Añade otra lista"
                className="form-list"
              />
              <input
                type="text"
                value={newLimit}
                onChange={handleInputChange2}
                placeholder="Añade el limite de tareas"
                className="form-list"
              />
              {showAddButton && (
                <AddButton onClick={addList} buttonStyle={{ color: 'black' }} />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
