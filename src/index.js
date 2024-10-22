import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { ListProvider } from './componentes/context/ListContext';
import { WorkspaceProvider } from './componentes/context/WorkspaceContext'; // Asegúrate de importar el WorkspaceProvider
import { UsersProvider } from './componentes/context/UsersContext';

const clientId = "620787684491-us81869i1822t97vrnvdc70o6tdpdki9.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <ListProvider>
      <WorkspaceProvider>
        <UsersProvider>
        <App />
      </UsersProvider>
      </WorkspaceProvider>
    </ListProvider>
  </GoogleOAuthProvider>
);
