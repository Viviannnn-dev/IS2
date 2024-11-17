import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './dashboard.css'; // Asegúrate de que tu CSS está importado

const Dashboard = ({ tasks }) => {
  // Definimos el conteo de tareas según los diferentes estados
  const taskCounts = {
    total: tasks.length,
    open: tasks.filter(task => task.status === 'open').length, // Cambiado de 'To Do' a 'open'
    closed: tasks.filter(task => task.status === 'closed').length, // Cambiado de 'Done' a 'closed'
    overdue: tasks.filter(task => new Date(task.due_date) < new Date()).length,
    // Tareas atrasadas: Se considera atrasada si su fecha de vencimiento es anterior a la fecha actual
    // pero no está completamente vencida (es decir, vencida en el mismo día o antes).
    overdueTasks: tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      const currentDate = new Date();
      // Filtramos las tareas que están vencidas o están en el mismo día de vencimiento
      return dueDate < currentDate && dueDate >= currentDate.setDate(currentDate.getDate() - 1);
    }).length,
  };

  // Datos para el gráfico de pie
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

  return (
    <div className="dashboard">
      <div className="charts">
        <div>
          <BarChart width={400} height={300} data={dataBar}>
            <XAxis dataKey="name" stroke="#000" /> {/* Cambia el color de las etiquetas en el eje X */}
            <YAxis stroke="#000" /> {/* Cambia el color de las etiquetas en el eje Y */}
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#333333a2" strokeWidth={2} /> {/* Color de la barra y su borde */}
          </BarChart>
        </div>
        <div>
          <PieChart width={400} height={400}>
            <Pie data={dataPie} cx={110} cy={120} outerRadius={80} fill="#82ca9d" label> {/* Ajusta el valor de cy para mover el gráfico hacia arriba */}
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
    </div>
  );
};

export default Dashboard;
