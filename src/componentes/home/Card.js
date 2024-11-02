import React, { useState } from 'react';
import CardDetailModal from '../forms/CardDetailModal';

const Card = ({ card, error, onCardUpdate, onMoveCard, reloadTasks }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className={`card ${error}`} onClick={handleOpenModal}>
        {card.name}
      </div>
      <CardDetailModal
        show={showModal}
        onHide={handleCloseModal}
        card={card}
        onCardUpdate={onCardUpdate} // Pasar la función de actualización de tarjeta
        onMoveCard={onMoveCard} // Pasar la función de mover tarjeta
        reloadTasks={reloadTasks} // Pasar reloadTasks a CardDetailModal
      />
    </>
  );
};

export default Card;
