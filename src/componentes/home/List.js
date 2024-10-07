import React, { useState } from 'react';
import Card from './Card';
import AddButton from '../button/AddButton';

const List = ({ list, listIndex, onAddCard ,onRenameList,onDeleteList }) => {
  const [newCardName, setNewCardName] = useState('');
  const [showAddButton, setShowAddButton] = useState(false); // Estado para mostrar el botón de agregar
  const [isEditingName, setIsEditingName] = useState(false);
  const [newListName, setNewListName] = useState(list.name);

  const handleEditName = () => setIsEditingName(true);
  const handleListNameChange = (e) => setNewListName(e.target.value);

  const addCard = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    if (newCardName) {
      onAddCard(listIndex, newCardName); // Llamar a la función para añadir la tarjeta
      setNewCardName(''); // Limpiar el campo de entrada
      setShowAddButton(false); // Ocultar el botón después de agregar la tarjeta
    }
  };

  const handleInputChange = (e) => {
    setNewCardName(e.target.value);
    setShowAddButton(e.target.value.trim() !== '');
  };

  const saveListName = () => {
    setIsEditingName(false);
    if (newListName.trim() !== '') {
      onRenameList(listIndex, newListName); // Llamar a la función para renombrar la lista
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
        {list.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>

      <form onSubmit={addCard} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={newCardName}
          onChange={handleInputChange}
          placeholder="Añade una tarjeta"
          className='form-card'
        />
        {showAddButton && <AddButton onClick={addCard} />}
      </form>
    </div>
  );
};

export default List;
