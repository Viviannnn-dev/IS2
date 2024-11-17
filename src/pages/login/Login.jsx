import React, { useState } from 'react';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import './styles/login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Manejo de registro
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Usuario registrado con éxito');
        setIsSignUpActive(false);
      } else {
        console.error('Error al registrar usuario', data);
      }
    } catch (error) {
      console.error('Error en la solicitud de registro', error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Error al iniciar sesión con Google');
  };

  // Manejo de inicio de sesión
  const handleSignIn = async (e) => {
    e.preventDefault();
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));  // Usamos JSON.stringify para guardar objetos
        navigate('/workspace');
      } else {
        console.error('Error al iniciar sesión', data);
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión', error);
    }
  };

  // Manejo de SSO con Google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Token de Google:', tokenResponse);
      try {
        const res = await fetch('http://localhost:8000/api/googleLogin/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (res.ok) {
          console.log('Inicio de sesión con Google exitoso');
          localStorage.setItem('token', data.token);
          navigate('/workspace');
        } else {
          console.error('Error al iniciar sesión con Google', data);
        }
      } catch (error) {
        console.error('Error en la solicitud de inicio de sesión con Google', error);
      }
    },
    onError: () => {
      console.error('Error al iniciar sesión con Google');
    },
  });

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
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="button registrar-button">Registrarse</button>
            <GoogleLogin
    onSuccess={googleLogin}
    onError={handleGoogleLoginError}
    useOneTap
    buttonText="Registrar con Google"
/>


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
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="button">Ingresar</button>
            <GoogleLogin
              onSuccess={googleLogin}
              onError={handleGoogleLoginError}
              useOneTap
            />
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
