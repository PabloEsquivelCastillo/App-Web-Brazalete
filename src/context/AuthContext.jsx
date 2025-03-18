import React, { createContext, useContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado para almacenar la información del usuario
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token); // Decodificar el token al iniciar
    }
    return null;
  });

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem('token', token); // Guardar el token en localStorage
    setUser(jwtDecode(token)); // Decodificar y guardar el usuario
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    setUser(null); // Limpiar el usuario
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}