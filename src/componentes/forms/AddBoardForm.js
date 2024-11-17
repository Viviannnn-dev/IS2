import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './addBoardForm.css';
import Button from 'react-bootstrap/Button';
import { useWorkspace } from '../context/WorkspaceContext';

const AddBoardForm = ({ onAddBoard, onClose }) => {
  const { workspace } = useWorkspace();
  const [boardName, setBoardName] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boardName) {
      setShowError(true);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/boards/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: boardName, workspace: workspace.name }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Tablero creado con éxito');
        const newBoard = { id: data.id, name: data.name, workspace: workspace.name };
        onAddBoard(newBoard);
        setBoardName('');
        setShowError(false);
        onClose();
      } else {
        console.error('Error al guardar el tablero', data);
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
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
            onChange={(e) => {
              setBoardName(e.target.value);
              if (showError && e.target.value) setShowError(false);
            }}
            className="form-control-sm"
          />
          {showError && <p className="error-message">Campo Obligatorio</p>}
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
