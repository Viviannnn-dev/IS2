// List.jsx
import React, { useState, useEffect } from 'react';
import Card from './Card';
import AddButton from '../button/AddButton';

const List = ({ list, listIndex, onRenameList, onDeleteList, listNames }) => {
  const [newCardName, setNewCardName] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/lists/cards/${list.id}/`);
        if (response.ok) {
          const data = await response.json();
          setCards(data);
        } else {
          console.error('Error al obtener las tarjetas:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchCards();
  }, [list.id]);

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
            setError('');
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
        setError(`No se pueden añadir más de ${list.maxWIP} tarjetas a esta lista.`);
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
        {cards.map((card, index) => {
          // Comprobar si la tarjeta actual excede el límite
          const isLimitExceeded = cards.length > list.maxWIP && index === cards.length - 1;
          return (
            <Card
              key={index}
              card={card}
              error={isLimitExceeded ? 'card-limit-exceeded' : ''}
              listNames={listNames}
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
    </div>
  );
};

export default List;
