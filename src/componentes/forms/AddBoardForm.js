import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './addBoardForm.css';
import Button from 'react-bootstrap/Button';
import { useWorkspace } from '../context/WorkspaceContext';


const AddBoardForm = ({ onAddBoard, onClose }) => {
  const { workspace } = useWorkspace();
  console.log('WORKSPACE');
  console.log(workspace);
  console.log(workspace.id);

  const [boardName, setBoardName] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Validar que ambos campos tengan contenido
    if (boardName) {
      try {
        const res = await fetch('http://localhost:8000/api/boards/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: boardName, workspace: workspace.name }), // Datos del registro
        });

        const data = await res.json();

        if (res.ok) {
          console.log('Tablero creado con éxito');
          const newBoard = { id: data.id, name: data.name, workspace: workspace.name }; // Usar los datos devueltos
            onAddBoard(newBoard); // Llamar a la función onAddBoard con el nuevo board
            setBoardName(''); // Limpiar el campo
            onClose(); // Cerrar el formulario
        } else {
          console.error('Error al guardar el tablero', data);
        }
      } catch (error) {
        console.error("Error en la solicitud", error);
      }
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
