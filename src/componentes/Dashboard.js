import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './dashboard.css'; // Asegúrate de que tu CSS está importado

const Dashboard = ({ tasks }) => {
  const [workspaceUsers, setWorkspaceUsers] = useState([]);

  const getTaskStatus = (dueDate) => {
    const currentDate = new Date();
  
    // Asegurarnos de que solo se tome la fecha, sin considerar la hora
    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    console.log(`Fecha actual (sin hora): ${currentDateWithoutTime}`);
  
    const taskDueDate = new Date(dueDate);
  
    // Asegurarnos de que solo se tome la fecha de vencimiento, sin la hora
    const taskDueDateWithoutTime = new Date(taskDueDate.getFullYear(), taskDueDate.getMonth(), taskDueDate.getDate());
    
    console.log(`Fecha de vencimiento de la tarea (sin hora): ${taskDueDateWithoutTime}`);
  
    // Si la tarea está vencida (la fecha de vencimiento ya pasó)
    if (taskDueDateWithoutTime < currentDateWithoutTime) {
      console.log('La tarea está Vencida.');
      return 'Vencida'; // Tarea vencida (ya pasó la fecha)
    }
  
    // Si la tarea vence hoy (comparando solo la fecha, sin la hora)
    if (taskDueDateWithoutTime.getTime() === currentDateWithoutTime.getTime()) {
      console.log('La tarea vence hoy.');
      return 'Vence hoy'; // Tarea vence hoy
    }
  
    console.log('La tarea no está Vencida ni Vence hoy.');
    return 'No vencida';
  };

  // Contar las tareas por estado
  const taskCounts = {
    total: tasks.length,
    open: tasks.filter(task => task.status === 'open').length, // Cambiado de 'To Do' a 'open'
    closed: tasks.filter(task => task.status === 'closed').length, // Cambiado de 'Done' a 'closed'
    overdue: tasks.filter(task => getTaskStatus(task.due_date) === 'Vencida').length, // Tareas vencidas
    overdueTasks: tasks.filter(task => getTaskStatus(task.due_date) === 'Vence hoy').length, // Tareas que vencen hoy
  };

  // Datos para el gráfico de pie (estadísticas generales)
  const dataPie = [
    { name: 'Open', value: taskCounts.open }, // Cambiado de 'To Do' a 'Open'
    { name: 'Closed', value: taskCounts.closed }, // Cambiado de 'Done' a 'Closed'
  ];

  // Datos para el gráfico de barras (incluyendo tareas atrasadas)
  const dataBar = [
    { name: 'Atrasadas', value: taskCounts.overdueTasks }, // Agregado gráfico de tareas atrasadas
    { name: 'Vencidas', value: taskCounts.overdue },
    { name: 'Total de Tareas', value: taskCounts.total },
  ];

  // Agrupar tareas por lista
  const tasksByList = tasks.reduce((acc, task) => {
    const listName = task.list_name || 'Sin Lista';
    if (!acc[listName]) {
      acc[listName] = [];
    }
    acc[listName].push(task);
    return acc;
  }, {});

  // Datos para el gráfico de torta por lista
  const pieDataByList = Object.keys(tasksByList).map(listName => ({
    name: `${listName}`,
    value: tasksByList[listName].length,
    tasks: tasksByList[listName].map(task => task.name).join(', ')  // Concatenamos los nombres de las tareas
  }));

  return (
    <div className="dashboard">
      <div className="charts">
        <div>
          <h2>Estadísticas de Tareas</h2>
          <BarChart width={400} height={300} data={dataBar}>
            <XAxis dataKey="name" stroke="#000" />
            <YAxis stroke="#000" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#333333a2" strokeWidth={2} />
          </BarChart>
        </div>

        <div className="charts">
          <div className="chart-container">
            <h3>Tareas por Lista</h3>
            <PieChart width={300} height={300}>
              <Pie data={pieDataByList} cx={110} cy={120} outerRadius={80} label>
                {pieDataByList.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="chart-container">
            <h3>Estado de Tareas</h3>
            <PieChart width={300} height={300}>
              <Pie data={dataPie} cx={110} cy={120} outerRadius={80} fill="#82ca9d" label>
                {dataPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Open' ? '#ffb3d9' : entry.name === 'Closed' ? '#add8e6' : '#b2e2b2'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
        <div className="tasks-list">
  <h3>Tareas por Usuario</h3>
  <div className="tasks-table-container">
    <table className="tasks-table">
      <thead>
        <tr>
          <th>Nombre del Usuario</th>
          <th>Tareas Asignadas</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tasks.reduce((acc, task) => {
          const owner = task.owner_username || 'Sin propietario';
          if (!acc[owner]) {
            acc[owner] = [];
          }
          acc[owner].push(task.name);
          return acc;
        }, {})).map(([owner, tasks]) => (
          <tr key={owner}>
            <td>{owner}</td>
            <td>{tasks.join(', ')}</td> {/* Listado de tareas asignadas al usuario */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      </div>


    </div>
  );
};

export default Dashboard;
