import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './addBoardForm.css';
import Button from 'react-bootstrap/Button';

const AddBoardForm = ({ onAddBoard, onClose }) => {
  const [boardName, setBoardName] = useState('');
  const [workspace, setWorkspace] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Validar que ambos campos tengan contenido
    if (boardName && workspace) {
      const newBoard = { name: boardName };
      console.log("Form submitted with:", { name: boardName, workspace }); // Debug
      onAddBoard(newBoard); // Llamar a la función onAddBoard sin parámetros, ya que no los usas en handleAddBoard
      setBoardName(''); // Limpiar el campo
      setWorkspace(''); // Limpiar el campo
      onClose(); // Cerrar el formulario
    } else {
      console.log("Form fields are empty"); // Debug para saber si algún campo está vacío
    }
  };

  return (
    <div className="add-board-form">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-1 form-tablero" controlId="nombre">
          <Form.Label>Nombre del tablero</Form.Label>
          <Form.Control
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="form-control-sm"
          />
        </Form.Group>
        <Form.Group className="mb-2 form-tablero" controlId="espacio">
          <Form.Label>Espacio de trabajo asociado</Form.Label>
          <Form.Control
            type="text"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="form-control-sm"
          />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button type="submit" variant="outline-light" className="btn-sm">
            Crear
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddBoardForm;
