import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario

  // Verificar si hay un usuario guardado en localStorage al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('token');
    if (savedUser) {
      setUser(savedUser); // Actualizar el estado con el usuario almacenado
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirige a login si el usuario no está autenticado */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Login */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* Home solo es accesible si hay un usuario */}
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
