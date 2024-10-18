import React, { useState } from 'react';
import './styles/login.css';
import { useNavigate } from 'react-router-dom'; // Para la redirección

export default function Login() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para redireccionar

  // Función para manejar el registro
  const handleSignUp = async (e) => {
    e.preventDefault(); // Evita la recarga de la página

    // Enviar los datos al backend para crear el usuario
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Datos del registro
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Usuario registrado con éxito');
        setIsSignUpActive(false); // Cambia al formulario de inicio de sesión después del registro
      } else {
        console.error('Error al registrar usuario', data);
      }
    } catch (error) {
      console.error("Error en la solicitud de registro", error);
    }
  };

  // Función para manejar el inicio de sesión
  const handleSignIn = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
  
    try {
      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log('Inicio de sesión exitoso');
        console.log('Token:', data.token);  
        localStorage.setItem('token', data.token); // Guardar el token en el almacenamiento local
        navigate('/home'); // Redirigir a la página principal
      } else {
        console.error('Error al iniciar sesión', data);
      }
      
    } catch (error) {
      console.error("Error en la solicitud de inicio de sesión", error);
    }
  };

  const handleSignUpClick = () => {
    setUsername('');
    setPassword('');
    setIsSignUpActive(true); 
  };

  const handleSignInClick = () => {
    setUsername('');
    setPassword('');
    setIsSignUpActive(false); 
  };

  return (
      <div className='login-base'>
        <div className={`container-login ${isSignUpActive ? 'right-panel-active' : ''}`}>
          <div className="form-container-login sign-up-container-login">
            <form className="form" onSubmit={handleSignUp}>
              <h1>Crea tu Cuenta</h1>
              <input
                type="text"
                className="input-field"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Captura del usuario
                required
              />
              <input
                type="password"
                className="input-field"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura de la contraseña
                required
              />
              <button type="submit" className="button registrar-button">Registrarse</button>
            </form>
          </div>

          <div className="form-container-login sign-in-container-login">
            <form className="form" onSubmit={handleSignIn}>
              <h1>Iniciar Sesión</h1>
              <input
                type="text"
                className="input-field"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Captura del usuario
                required
              />
              <input
                type="password"
                className="input-field"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura de la contraseña
                required
              />
              <button type="submit" className="button">Ingresar</button>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>¡Bienvenido!</h1>
                <p>Inicia sesión con tu cuenta</p>
                <button className="ghost" onClick={handleSignInClick}>Inicia sesión</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>¿No tienes una cuenta?</h1>
                <p>Crea una</p>
                <button className="ghost" onClick={handleSignUpClick}>Registrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
