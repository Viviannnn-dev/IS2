import React, { useState, useRef } from 'react';
import List from './List';
import './board.css';
import AddButton from '../button/AddButton';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Board = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);
  const [smShow, setSmShow] = useState(false); // Estado del modal pequeño
  const [exceededListIndex, setExceededListIndex] = useState(null); // Para rastrear qué lista excedió el límite
  const [exceededCardIndex, setExceededCardIndex] = useState(null); // Para rastrear qué tarjeta excedió el límite

  const listsContainerRef = useRef(null);

  //nombre de las listas
  const getListNames = () => {
    return lists.map(list => list.name); 
  };

  // Agregar una nueva lista
  const addList = () => {
    const parsedLimit = parseInt(newLimit, 10); 
    if (newListName && newLimit) {
      setLists([{ name: newListName, cards: [], limit: parsedLimit }, ...lists]); // Agregar el límite a la lista
      setNewListName('');
      setNewLimit('');
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
    setNewLimit(value);
    validateAddButton(newListName, value);
  };

  const validateAddButton = (listName, limit) => {
    setShowAddButton(listName.trim() !== '' && limit.trim() !== '');
  };

  // Función para añadir una tarjeta a una lista específica
  const addCardToList = (listIndex, cardName) => {
    const updatedLists = [...lists];
    const list = updatedLists[listIndex];
  
    // Verificar si se ha alcanzado el límite de tarjetas
    if (list.cards.length < list.limit) {
      // Añadir la tarjeta normalmente si no se ha alcanzado el límite
      updatedLists[listIndex].cards.push({ name: cardName, exceedsLimit: false });
    } else {
      // Añadir la tarjeta con la indicación de que excede el límite
      updatedLists[listIndex].cards.push({ name: cardName, exceedsLimit: true });
      setSmShow(true); // Mostrar el modal
      setExceededListIndex(listIndex); // Guardar el índice de la lista que excedió
      setExceededCardIndex(list.cards.length); // Guardar el índice de la tarjeta excedida
    }
  
    setLists(updatedLists); // Actualizar el estado siempre que se agregue una tarjeta
  };

  const handleCloseModal = () => {
    if (exceededListIndex !== null && exceededCardIndex !== null) {
      const updatedLists = [...lists];
      
      // Eliminar la última tarjeta añadida (que excedió el límite)
      updatedLists[exceededListIndex].cards.pop();
      setLists(updatedLists); // Actualizar el estado de las listas
    }
    setSmShow(false); // Cerrar el modal
    setExceededListIndex(null); // Reiniciar los índices
    setExceededCardIndex(null);
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

  return (
    <div className="board">
      <div className="lists-container" ref={listsContainerRef}>
        <div className="lists">
          {lists.map((list, index) => (
            <List key={index} list={list} listIndex={index} onAddCard={addCardToList} onRenameList={renameList} onDeleteList={deleteList} listNames={getListNames()} />
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
                type="number"
                value={newLimit}
                onChange={handleInputChange2}
                placeholder="Añade el limite de tareas"
                className="form-list"
              />
              {showAddButton && (
                <Button onClick={addList} type="submit" variant="outline-secondary" className="btn-sm" style={{ alignSelf: 'center'}}>
                  Crear
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* Modal pequeño que se muestra cuando se excede el límite */}
      <Modal
        size="sm"
        show={smShow}
        onHide={handleCloseModal}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Límite alcanzado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Has alcanzado el límite de tareas en esta lista.
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Board;
