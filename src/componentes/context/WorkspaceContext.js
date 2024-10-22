import React, { createContext,useContext, useState } from 'react';

// Crear el contexto
export const WorkspaceContext = createContext();

// Proveedor del contexto
export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspace] = useState(null);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
    return useContext(WorkspaceContext);
};
