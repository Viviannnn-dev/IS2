import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        {/* Otras rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
