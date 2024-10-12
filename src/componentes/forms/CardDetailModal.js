import React, { useState , useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

import './cardDetailModal.css';

const CardDetailModal = ({ show, onHide, card, onSave, lists }) => {
    const [formData, setFormData] = useState({
        name: '', // Nombre de la actividad
        description: '', // Descripción
        dueDate: '', // Fecha de vencimiento
        assignedUser: '', // Usuario asignado
        label: '', // Etiqueta
        selectedList: '', // Estado seleccionado
        creationDate: '', // Fecha de creación
    });

    useEffect(() => {
        if (show) {
            setFormData({
                name: card.name || '', // Muestra el valor existente o vacío
                description: card.description || '', // Muestra el valor existente o vacío
                dueDate: card.dueDate || '', // Muestra el valor existente o vacío
                assignedUser: card.assignedUser || '', // Muestra el valor existente o vacío
                label: card.label || '', // Muestra el valor existente o vacío
                selectedList: card.selectedList || '', // Muestra el estado existente o vacío
                creationDate: card.creationDate || new Date().toISOString().split('T')[0], // Si no existe, establece la fecha actual
            });
        }
    }, [show, card]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Actualiza el campo correspondiente
        }));
    };

    const handleSave = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        onSave({ ...formData, id: card.id }); // Pasar el objeto completo a onSave, incluyendo el ID de la tarjeta para la actualización
        onHide(); // Cerrar el modal
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName="custom-modal">
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title className="modal-title-custom">{card.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form onSubmit={handleSave}>
                    <Form.Group className="mb-1" controlId="nombre">
                        <Form.Label>Nombre de la Actividad</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-sm"
                            name="name" // Añadir nombre
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 " controlId="descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-sm"
                            name="description" // Añadir nombre
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 " controlId="fechavencimiento">
                        <Form.Label>Fecha de Vencimiento</Form.Label>
                        <Form.Control
                             type="date" // Cambiar a tipo date para mejor selección
                             className="form-control-sm"
                             name="dueDate" // Añadir nombre
                             value={formData.dueDate}
                             onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 " controlId="usuario">
                        <Form.Label>Usuario Asignado</Form.Label>
                        <Form.Control
                           type="text"
                           className="form-control-sm"
                           name="assignedUser" // Añadir nombre
                           value={formData.assignedUser}
                           onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2 " controlId="etiqueta">
                        <Form.Label>Etiqueta</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-sm"
                            
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="estado">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="selectedList" // Añadir nombre
                            value={formData.selectedList}
                            onChange={handleChange}
                            className="form-control-sm"
                        >
                            <option value="">Selecciona un estado</option>
                            {lists.map((list, index) => (
                                <option key={index} value={list}>
                                    {list} {/* Nombre de la lista */}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <div className="button-container"> {/* Contenedor de botones */}
                        <Button variant="secondary" onClick={onHide} className="mr-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CardDetailModal;
