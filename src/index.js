import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { ListProvider } from './componentes/context/ListContext'; // Asegúrate de importar el ListProvider

const clientId = "620787684491-us81869i1822t97vrnvdc70o6tdpdki9.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <ListProvider> {/* Cambia ListContext por ListProvider */}
      <App />
    </ListProvider>
  </GoogleOAuthProvider>
);
