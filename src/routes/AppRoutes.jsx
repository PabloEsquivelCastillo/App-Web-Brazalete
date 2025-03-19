import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import { useAuth } from '../context/AuthContext';
import MenuCuidador from '../pages/admin/CuidadoresActivos';
import CuidadoresActivos from '../pages/admin/CuidadoresActivos';
import EditarCuidador from '../pages/admin/EditarCuidador';

function AppRoutes() {
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}

        <Route path="/" element={<Login />} />

        {/* Rutas protegidas para admin */}
        <Route
          path="/admin/dashboard"
          element={
            user?.rol === 'admin' ? ( // Verificar si el usuario es admin
              <CuidadoresActivos/>
            ) : (
              <Navigate to="/login" /> // Redirigir al login si no es admin
            )
          }
        />
        <Route
        path='editar/:id'
        element={<EditarCuidador/>}/>

        {/* Rutas protegidas para cuidador */}
        <Route
          path="/cuidador/dashboard"
          element={
            user?.rol === 'cuidador' ? ( // Verificar si el usuario es cuidador
              <MenuCuidador />
            ) : (
              <Navigate to="/login" /> // Redirigir al login si no es cuidador
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;