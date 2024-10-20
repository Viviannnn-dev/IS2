// Card.jsx
import React, { useState } from 'react';
import CardDetailModal from '../forms/CardDetailModal';

const Card = ({ card, error, listNames }) => {
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
        lists={listNames}
      />
    </>
  );
};

export default Card;
