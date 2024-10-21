import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const ListContext = createContext();

// Proveedor del contexto
export const ListProvider = ({ children }) => {
    const [lists, setLists] = useState([]);

    return (
        <ListContext.Provider value={{ lists, setLists }}>
            {children}
        </ListContext.Provider>
    );
};

// Hook para acceder al contexto
export const useLists = () => {
    return useContext(ListContext);
};
