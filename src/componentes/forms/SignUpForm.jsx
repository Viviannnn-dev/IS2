import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './SignUpForm.css'; // Asegúrate de tener los estilos CSS adecuados

const SignUpForm = ({ onSignUp, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(username, password);
    setUsername(''); // Limpiar el campo después del registro
    setPassword(''); // Limpiar el campo después del registro
  };

  return (
    <div className="sign-up-modal">
      <div className="sign-up-content">
        <button className="close-button" onClick={onClose}>X</button>
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
            <Button type="submit" variant="outline-light" className="btn-sm">
              Registrar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
