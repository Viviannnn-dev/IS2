import React, { useState } from 'react';
import './styles/login.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const clientId = "620787684491-us81869i1822t97vrnvdc70o6tdpdki9.apps.googleusercontent.com";

export default function Login() {
  const onSuccess = (response) => {
    console.log(response);
  };

  const onFailure = (error) => {
    console.log("Something went wrong", error);
  };

  const [isSignUpActive, setIsSignUpActive] = useState(false);
  
  // Función para activar el formulario de registro
  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  // Función para volver al formulario de inicio de sesión
  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className='login-base'>
        <div className={`container-login ${isSignUpActive ? 'right-panel-active' : ''}`}>
          <div className="form-container-login sign-up-container-login">
            {/* Formulario de registro */}
            <form className="form">
              <h1>Crea tu Cuenta</h1>
              <input type="text" className="input-field" placeholder="Usuario" />
              <input type="password" className="input-field" placeholder="Contraseña" />
              <button type="submit" className="button registrar-button">Registrarse</button>
              {/* Botón personalizado de Google para el registro */}
              <div className='btn'>
                <GoogleLogin
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  logoAlignment="left" // Ajusta el logo a la izquierda si es necesario
                >
                  <button className="google-btn">Continuar con Google</button>
                </GoogleLogin>
              </div>
            </form>
          </div>

          <div className="form-container-login sign-in-container-login">
            {/* Formulario de inicio de sesión */}
            <form className="form">
              <h1>Iniciar Sesión</h1>
              <input type="text" className="input-field" placeholder="Usuario"/>
              <input type="password" className="input-field" placeholder="Contraseña" />
              <button type="submit" className="button">Ingresar</button>
              <a href="/Recuperar" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
              <div className='btn'>
                <GoogleLogin
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={'single_host_origin'}
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
                <p>Crea una </p>
                <button className="ghost" onClick={handleSignUpClick}>Registrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
