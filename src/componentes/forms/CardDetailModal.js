import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './cardDetailModal.css';
import { useLists } from '../context/ListContext';

const CardDetailModal = ({ show, onHide, card , onCardUpdate}) => {
    console.log(card.id);
    const { lists } = useLists();
    const [selectedColor, setSelectedColor] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [showTasks, setShowTasks] = useState(false); // Estado para controlar la visibilidad de la lista de tareas
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setHours(0,0, 0, 0, 0);
    yesterday.setDate(currentDate.getDate() - 1);
    function areDatesEqual(date1, date2) {
        console.log(date1);
        console.log(date2);
        return date1.toDateString() === date2.toDateString();
    }
    
    const [errorMessage, setErrorMessage] = useState('');

    const [formDataTask, setFormDataTask] = useState({
        name: '',
        description: '',
        status: 'open',
        dueDate: new Date().toISOString().split('T')[0]    });

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setShowTasks(false); // Limpiar la visibilidad de la lista de tareas al cerrar el modal
    };

    const handleChangeTask = (e) => {
        const { name, value } = e.target;
        setFormDataTask((prevData) => ({
            ...prevData,
            [name]: value
        }));

        setErrorMessage('');
    };

    const handleShowTasks = () => {
        setShowTasks(!showTasks); // Alternar la visibilidad de la lista de tareas
    };

    const handleSaveTask = () => {
        // Verificar que ningún campo esté vacío
        if (!formDataTask.name || !formDataTask.description || !formDataTask.status || !formDataTask.dueDate) {
            setErrorMessage('Por favor, complete todos los campos.');
            return; // Detener la ejecución si hay campos vacíos
        }
        handleCloseModal();
        setTasks([...tasks, formDataTask]);
        setFormDataTask({ description: '', status: 'open', dueDate: '' });
        
    };
    
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
        if (show && card) {
            setFormData({
                name: card.name,
                description: card.description,
                dueDate: card.dueDate,
                selectedList: card.listId, // Id de la lista actual de la tarjeta
            });
        }
    }, [show, card]);

    const colorMapping = {
        '#ffb3d9': 1,
        '#add8e6': 2,
        '#b2e2b2': 3,
        '#ffcc99': 4,
    };
    

    useEffect(() => {
        const fetchCardData = async () => {
            if (show && card && card.id) {
                try {
                    const response = await fetch(`http://localhost:8000/api/cards/${card.id}/`);
                    if (response.ok) {
                        const data = await response.json();
    
                        // Aquí buscamos el color que coincide con el valor numérico en `data.label`
                        const colorKey = Object.keys(colorMapping).find(key => colorMapping[key] === data.label);
    
                        setFormData({
                            name: data.name || '',
                            description: data.description || '',
                            dueDate: data.due_date || '',
                            assignedUser: 'Ruth',
                            label: colorKey ? colorMapping[colorKey] : '', // Guarda el valor numérico
                            selectedList: '',
                            creationDate: data.creationDate || new Date().toISOString().split('T')[0],
                        });
    
                        // Si el color está definido en el mapeo, establece el color seleccionado
                        if (colorKey) {
                            setSelectedColor(colorKey); // Establece el color para el select
                        }
                    } else {
                        console.error('Error fetching card data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching card data:', error);
                }
            }
        };
    
        fetchCardData();
    }, [show, card]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Verifica si el campo es 'label' para manejar el color
        if (name === 'label') {
            setSelectedColor(value); // Actualiza el color seleccionado
            setFormData((prevData) => ({
                ...prevData,
                [name]: value, // Actualiza el campo correspondiente
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value, // Actualiza el campo correspondiente
            }));
        }
    };

    const handleSaveToDB = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/card-update/${card.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: formData.name, 
                    description: formData.description, 
                    due_date: formData.dueDate, 
                    owner: formData.assignedUser, 
                    label: formData.label, 
                    list: formData.selectedList,
                }),
            });
    
            if (response.ok) {
                const updatedCard = await response.json();
                console.log('Card updated successfully:', updatedCard);
                onCardUpdate(updatedCard); // Llamar a la función del componente padre
                onHide(); // Cerrar el modal
            } else {
                const errorData = await response.json();
                console.error('Failed to update card:', errorData);
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };
    

    const selectStyle = {
        backgroundColor: selectedColor || 'white',
        color: selectedColor ? 'black' : 'black',
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName="custom-modal">
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title className="modal-title-custom">{card.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form onSubmit={handleSaveToDB}>
                    <Form.Group className="mb-1" controlId="nombre">
                        <Form.Label>Nombre de la Actividad</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-sm"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-sm"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="fechavencimiento">
                        <Form.Label>Fecha de Vencimiento</Form.Label>
                        <Form.Control
                            type="date"
                            className="form-control-sm"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="usuario">
                        <Form.Label>Usuario Asignado</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-sm"
                            name="assignedUser"
                            value={formData.assignedUser}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="etiqueta">
    <Form.Label>Etiqueta</Form.Label>
    <Form.Select
        style={selectStyle}
        name="label"
        value={selectedColor} // Mantiene el color seleccionado directamente
        onChange={(e) => {
            const color = e.target.value;
            const numericValue = colorMapping[color]; // Obtiene el valor numérico correspondiente
            setSelectedColor(color);
            setFormData((prevData) => ({
                ...prevData,
                label: numericValue || '', // Guarda el valor numérico
            }));
        }}
    >
        <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Seleccione una opción</option>
        {Object.keys(colorMapping).map(color => (
            <option key={color} value={color} style={{ backgroundColor: color }}></option>
        ))}
    </Form.Select>
</Form.Group>
                    <Form.Group className="mb-2" controlId="estado">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="selectedList"
                            value={formData.selectedList}
                            onChange={handleChange}
                            className="form-control-sm"
                        >
                            <option value="">Selecciona un estado</option>
                            {lists.map((list) => (
                            <option key={list.id} value={list.id}> {/* Usa list.id como key y valor */}
                                {list.name} {/* Muestra el nombre de la lista */}
                            </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                    <div>
            <Button className="button-task" onClick={handleShowModal}>Añadir Tarea</Button>
            
            <Button className="button-task" onClick={handleShowTasks}>
                {showTasks ? 'Ocultar Tareas' : 'Listar Tareas'}
            </Button>

        <div className="task">
            {showTasks && (
                <div className="task-list">
                    {tasks.length === 0 ? (
                        <p>No existen tareas.</p>
                    ) : (
                        tasks.map((task, index) => {
                            // Convertir la fecha de vencimiento a un objeto Date
                            const [year, month, day] = task.dueDate.split('-').map(Number);
                            const dueDate = new Date(year, month - 1, day); // Crea la fecha en medianoche local
                            

                            console.log(task.dueDate)


                            // Determinar la clase según la fecha de vencimiento
                            let taskClass = 'task-item'; // Clase base

                            // Asignar la clase "atrasada" o "vencido"
                            if ( areDatesEqual(dueDate, currentDate) || areDatesEqual(dueDate,yesterday)) {
                                taskClass = 'late'; // Si la fecha es hoy o ayer
                            } else if(dueDate<currentDate){
                                taskClass= 'defeated';
                            }

                            return (
                                <div key={index} className={taskClass}>
                                    <p>Nombre: {task.name}</p>
                                    <p>Descripción: {task.description}</p>
                                    <p>Estado: {task.status}</p>
                                    <p>Fecha de Vencimiento: {task.dueDate}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
        <div class="color-box">
            <span class="box-late"></span>
            <span class="label">Atrasado</span>
        </div>
        <div class="color-box">
            <span class="box-defeated"></span>
            <span class="label">Vencido</span>
        </div>




            <Modal className='modal-task' show={showModal} onHide={handleCloseModal}>
                <Modal.Header className='modal-header-task' closeButton>
                    <Modal.Title className=''>Añadir Tarea</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <Form>
                    <Form.Group controlId="name" className="mb-0 mt-0">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formDataTask.name}
                                onChange={handleChangeTask}
                                className="form-control-sm"
                            />
                        </Form.Group>
                        <Form.Group controlId="descripcion" className="mb-0">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formDataTask.description}
                                onChange={handleChangeTask}
                                className="form-control-sm"
                            />
                        </Form.Group>
                        <Form.Group controlId="estado" className="mb-0">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                name="status"
                                value={formDataTask.status}
                                onChange={handleChangeTask}
                                className="form-select-sm"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="vencimiento" className="mb-0">
                            <Form.Label>Fecha de Vencimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="dueDate"
                                value={formDataTask.dueDate}
                                onChange={handleChangeTask}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className ="footer-task">
                    <Button variant="secondary" onClick={handleCloseModal} className='btn-sm'>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveTask} className='btn-sm'>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
                    <div className="button-container">
                        <Button variant="secondary" onClick={onHide} className="mr-0">
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
