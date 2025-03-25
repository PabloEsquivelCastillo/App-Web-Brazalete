import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import { useAuth } from '../context/AuthContext';
import CuidadoresActivos from '../pages/admin/CuidadoresActivos';
import Solicitudes from '../pages/admin/SolicitudesPendientes';
import EditarCuidador from '../pages/admin/EditarCuidador';
import Recordatorios from '../pages/admin/RecordatoriosAdmin';
import SolicitudesPendientes from '../pages/admin/SolicitudesPendientes';
import RegistrarMedicamento from '../pages/admin/RegistrarMedicamentos';
import Medicamentos from '../pages/admin/MedicamentosAdmin';
import EditarMedicamento from '../pages/admin/EditarMedicamento';

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
            <Route path="/admin/dashboard" element={<CuidadoresActivos />} />
            <Route path="/admin/cuidadoresActivos" element={<CuidadoresActivos />} />
            <Route path="/admin/solicitudes" element={<Solicitudes />} />
            <Route path="/admin/editar/:id" element={<EditarCuidador />} />
            <Route path="/admin/Medicamentos" element={<Medicamentos />} />
            <Route path="/admin/RegistrarMedicamento" element={<RegistrarMedicamento />} />
            <Route path="/admin/EditarMedicamento/:id" element={<EditarMedicamento />} />
            <Route path="/admin/Recordatorios" element={<Recordatorios />} />
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
