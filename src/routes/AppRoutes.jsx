import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import { useAuth } from '../context/AuthContext';
import CuidadoresActivos from '../pages/admin/CuidadoresActivos';
import Solicitudes from '../pages/admin/SolicitudesPendientes';
import EditarCuidador from '../pages/admin/EditarCuidador';
import MenuCuidador from '../pages/cuidador/MenuCuidador';
import SolicitudesPendientes from '../pages/admin/SolicitudesPendientes';

function AppRoutes() {
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas para admin */}
        {user?.rol === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<SolicitudesPendientes />} />
            <Route path="/admin/cuidadoresActivos" element={<CuidadoresActivos />} />
            <Route path="/admin/solicitudes" element={<Solicitudes />} />
            <Route path="/admin/editar/:id" element={<EditarCuidador />} />
          </>
        )}

        {/* Rutas protegidas para cuidador */}
        {user?.rol === 'cuidador' && (
          <Route path="/cuidador/dashboard" element={<MenuCuidador />} />
        )}

        {/* Redirigir si la ruta no existe o el usuario no tiene permisos */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
