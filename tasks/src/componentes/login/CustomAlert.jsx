import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './customAlert.css';

function CustomAlert({ message }) {
  const [show, setShow] = useState(true);
  const navigate = useNavigate(); // Obtiene la función navigate

  const handleClose = () => {
    setShow(false);
    navigate('/login'); // manda a /login
  };

  if (show) {
    return (
      <div className="custom-alert">
        <Alert variant="warning" onClose={handleClose} dismissible style={{ backgroundColor: '#d0e5f7', border: 'none' }}>
          <Alert.Heading className="alert-heading-custom">{message}</Alert.Heading>
        </Alert>
      </div>
    );
  }
}

export default CustomAlert;
