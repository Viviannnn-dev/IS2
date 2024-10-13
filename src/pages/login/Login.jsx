import React, { useState } from 'react';
import './styles/login.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Para la redirección

const clientId = "620787684491-us81869i1822t97vrnvdc70o6tdpdki9.apps.googleusercontent.com";

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
        body: JSON.stringify({ username, password }), // Enviar datos de inicio de sesión
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log('Inicio de sesión exitoso');
        
        // Guarda el token en localStorage
        localStorage.setItem('token', data.token); // Asegúrate de que tu backend devuelva un token
  
        // Redirigir a la página principal
        navigate('/home');
      } else {
        console.error('Error al iniciar sesión', data);
      }
    } catch (error) {
      console.error("Error en la solicitud de inicio de sesión", error);
    }
  };
  

  const handleSignUpClick = () => {
    setIsSignUpActive(true); // Cambia al formulario de registro
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false); // Cambia al formulario de inicio de sesión
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
              />
              <input
                type="password"
                className="input-field"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura de la contraseña
              />
              <button type="submit" className="button registrar-button">Registrarse</button>
              <div className='btn'>
                {/* Opción de registro con Google */}
                <GoogleLogin
                  onSuccess={() => {}}
                  onFailure={() => {}}
                />
              </div>
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
              />
              <input
                type="password"
                className="input-field"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura de la contraseña
              />
              <button type="submit" className="button">Ingresar</button>
              <a href="/Recuperar" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
              <div className='btn'>
                {/* Opción de inicio de sesión con Google */}
                <GoogleLogin
                  onSuccess={() => {}}
                  onFailure={() => {}}
                />
              </div>
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
    </GoogleOAuthProvider>
  );
}
