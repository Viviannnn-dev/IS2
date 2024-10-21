import React, { useState, useRef, useEffect } from 'react';
import List from './List';
import './board.css';
import AddButton from '../button/AddButton';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useLists } from '../context/ListContext';

const Board = ({ id, name, description }) => {
  const { lists, setLists } = useLists();
  const [newListName, setNewListName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);
  const [smShow, setSmShow] = useState(false); // Estado del modal pequeño
  const [exceededListIndex, setExceededListIndex] = useState(null); // Para rastrear qué lista excedió el límite
  const [exceededCardIndex, setExceededCardIndex] = useState(null); // Para rastrear qué tarjeta excedió el límite

  const listsContainerRef = useRef(null);

  
  console.log("Board ID:", id);
  console.log("Board Name:", name);

  // UseEffect para obtener las listas del tablero al cargar el componente
  useEffect(() => {
    const fetchLists = async () => {
      try {
        console.log("id:", id);

        const response = await fetch(`http://localhost:8000/api/lists/board/${id}/`);      
        const data = await response.json();
        setLists(data);
        console.log("Listas obtenidas:", data);
        console.log(lists);
      } catch (error) {
        console.error("Error al obtener las listas:", error);
      }
    };

    fetchLists();
  }, [id]); // Se ejecuta cuando el ID del tablero cambia

  //nombre de las listas
  const getListNames = () => {
    return lists.map(list => list.name);
  };

  // Agregar una nueva lista
  const addList = async (e) => {
    const parsedLimit = parseInt(newLimit, 10);

    if (newListName && newLimit) {
      try {
        const res = await fetch('http://localhost:8000/api/lists/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newListName, maxWIP: newLimit, board: id }), // Datos del registro
        });

        const data = await res.json();

        if (res.ok) {
          console.log('Tablero creado con éxito');
          setLists([{ id: data.id, name: newListName, maxWIP: newLimit, cards: [], limit: parsedLimit }, ...lists]); // Agregar el ID a la lista
          setNewListName('');
          setNewLimit('');
          setShowAddButton(false);
        } else {
          console.error('Error al guardar la lista', data);
        }
      } catch (error) {
        console.error("Error en la solicitud", error);
      }
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

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el formulario se envíe
  };

  return (
    <div className="board">
      <div className="lists-container" ref={listsContainerRef}>
        <div className="lists">
          {lists.map((list, index) => (
            <List key={index} list={list} listIndex={index} onRenameList={renameList} onDeleteList={deleteList} listNames={getListNames()} />
          ))}
          <div className="add-list-container">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
