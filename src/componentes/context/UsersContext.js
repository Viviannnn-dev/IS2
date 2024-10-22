import React, { createContext,useContext, useState } from 'react';

// Crear el contexto
export const UsersContext = createContext();

// Proveedor del contexto
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(null);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
    return useContext(UsersContext);
};
