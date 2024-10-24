import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './SignUpForm.css';

const SignUpForm = ({ onSignUp, onClose }) => {
  const [username, setUsername] = useState(''); // Inicialmente vacío
  const [password, setPassword] = useState(''); // Inicialmente vacío

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(username, password);
    setUsername(''); // Limpiar el campo después del registro
    setPassword(''); // Limpiar el campo después del registro
  };

  // Cierra el modal si se hace clic en el fondo del modal
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('sign-up-modal')) {
      onClose();
    }
  };

  return (
    <div className="sign-up-modal" onClick={handleBackgroundClick}>
      <div className="sign-up-content">
        <h2>Registrar Usuario</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-1 form-tablero" controlId="username">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control-sm"
            />
          </Form.Group>
          <Form.Group className="mb-1 form-tablero" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control-sm"
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit" variant="outline-light" className="btn-sm custom-btn">
              Registrar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
