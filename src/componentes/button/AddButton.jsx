// AddButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

const AddButton = ({ onClick , buttonStyle}) => {
  return (
    <Button
      variant="none" // Usamos un fondo claro
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,      
        boxShadow: 'none',
        lineHeight: '1',  
        border: 'none',
        color: 'rgba(240, 248, 255, 0.678)', 
        ...buttonStyle 
      }}
      aria-label="Add"
      onClick={onClick}
    >
      +
    </Button>
  );
};

export default AddButton;
