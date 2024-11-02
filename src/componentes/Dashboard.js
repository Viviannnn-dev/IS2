import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './dashboard.css'; // Asegúrate de que tu CSS está importado

const Dashboard = ({ tasks }) => {
  const taskCounts = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'To Do').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    done: tasks.filter(task => task.status === 'Done').length,
    overdue: tasks.filter(task => new Date(task.due_date) < new Date()).length,
  };

  const dataPie = [
    { name: 'To Do', value: taskCounts.todo },
    { name: 'In Progress', value: taskCounts.inProgress },
    { name: 'Done', value: taskCounts.done },
  ];

  const dataBar = [
    { name: 'Tareas Vencidas', value: taskCounts.overdue },
    { name: 'Total de Tareas', value: taskCounts.total },
  ];

  return (
    <div className="dashboard">
      <div className="charts">
        <div>
          <BarChart width={400} height={300} data={dataBar}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#333333a2" />
          </BarChart>
        </div>
        <div>
          <PieChart width={400} height={400}>
            <Pie data={dataPie} cx={200} cy={200} outerRadius={80} fill="#82ca9d" label>
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'To Do' ? '#ffb3d9' : entry.name === 'In Progress' ? '#add8e6' : '#b2e2b2'} />
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
