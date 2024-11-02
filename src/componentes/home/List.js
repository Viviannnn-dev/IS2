// List.jsx
import React, { useState, useEffect } from 'react';
import Card from './Card';
import AddButton from '../button/AddButton';
import Modal from 'react-bootstrap/Modal'; // Importar Modal de Bootstrap

const List = ({ list, listIndex, onRenameList, onDeleteList,onCardMoved, onCardList,reloadTasks }) => {
  const [newCardName, setNewCardName] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');const [showErrorModal, setShowErrorModal] = useState(false); 
  const [errorCardId, setErrorCardId] = useState(null); //

  useEffect(() => {
    fetchCards(); // Llama a fetchLists cuando el componente se monte o cambie el ID
  }, [list.id]);
  

  const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/lists/cards/${list.id}/`);
        if (response.ok) {
          const data = await response.json();
          setCards(data);
          onCardList();
        } else {
          console.error('Error al obtener las tarjetas:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    
  const onCardUpdate = () => {
    console.log('llamo para q vuelva a cargar las tarjetas')
    fetchCards();
  };
  

const handleCardMoved = (updatedCard, newListId) => {
  onCardMoved(updatedCard, newListId);
};

  const handleEditName = () => setIsEditingName(true);
  const handleListNameChange = (e) => setNewListName(e.target.value);

  const addCard = async (e) => {
    e.preventDefault();
    if (newCardName) {
      if (cards.length < list.maxWIP) {
        try {
          const response = await fetch('http://localhost:8000/api/cards/create/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newCardName,
              owner: 1,
              list: list.id,
            }),
          });

          if (response.ok) {
            const newCard = await response.json();
            setNewCardName('');
            setShowAddButton(false);
            setErrorCardId(null); 
            setCards((prevCards) => [...prevCards, newCard]);
          } else {
            console.error('Error al añadir la tarjeta:', response.statusText);
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      } else {
        // Si se excede el límite, añade la tarjeta visualmente
        const tempCard = { name: newCardName, owner: 1, list: list.id };
        setCards((prevCards) => [...prevCards, tempCard]);
        setNewCardName('');
        setShowAddButton(false);
        setErrorCardId(tempCard.id); 
        setShowErrorModal(true);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewCardName(e.target.value);
    setShowAddButton(e.target.value.trim() !== '');
  };

  const saveListName = () => {
    setIsEditingName(false);
    if (newListName.trim() !== '') {
      onRenameList(listIndex, newListName);
    }
  };

  const handleCloseModal = () => {
    // Al cerrar el modal, eliminar la tarjeta con el ID de error
    setCards((prevCards) => prevCards.filter(card => card.id !== errorCardId));
    setErrorCardId(null);
    setShowErrorModal(false); // Cerrar el modal
  };

  return (
    <div className="list">
      <button className="delete-list-button" onClick={() => onDeleteList(listIndex)}>
        🗑️
      </button>
      {isEditingName ? (
        <input
          type="text"
          value={newListName}
          onChange={handleListNameChange}
          onBlur={saveListName}
          onKeyDown={(e) => e.key === 'Enter' && saveListName()}
          autoFocus
          className="list-name-input"
        />
      ) : (
        <span className="board-label" onClick={handleEditName}>
          {list.name}
        </span>
      )}

      <div className="cards">
        {cards.map((card) => {
          // Comprobar si la tarjeta actual excede el límite
          const isLimitExceeded = cards.length > list.maxWIP && card.id === errorCardId;
          return (
            <Card
              key={card.id}
              card={card}
              error={isLimitExceeded ? 'card-limit-exceeded' : ''}
              onCardUpdate={onCardUpdate} // Pasar la función de actualización de tarjeta
              onMoveCard={handleCardMoved} // Pasar la función para mover tarjeta
              reloadTasks={reloadTasks}
            />
          );
        })}
      </div>

      <form onSubmit={addCard} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={newCardName}
          onChange={handleInputChange}
          placeholder="Añade una tarjeta"
          className="form-card"
        />
        {showAddButton && <AddButton onClick={addCard} />}
      </form>
      <Modal show={showErrorModal} onHide={handleCloseModal} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Límite de tarjetas superado para la lista: {list.name}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default List;
