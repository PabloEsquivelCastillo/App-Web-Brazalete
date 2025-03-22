import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import { useAuth } from '../context/AuthContext';
import CuidadoresActivos from '../pages/admin/CuidadoresActivos';
import Solicitudes from '../pages/admin/SolicitudesPendientes';
import EditarCuidador from '../pages/admin/EditarCuidador';
import SolicitudesPendientes from '../pages/admin/SolicitudesPendientes';
import Registro from '../pages/Registro';
import Perfil from '../pages/cuidador/Perfil';
import MedicamentosCuidador from '../pages/cuidador/Medicamentos';
import Brazalete from '../pages/cuidador/Brazaletes';
import Recordatorios from '../pages/cuidador/Recordatorios';
import Recuperar from '../pages/Recuperar';
import Contraseña from '../pages/cuidador/Contraseña';

function AppRoutes() {
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro/>}></Route>
        <Route path="/recuperar" element={<Recuperar/>}></Route>


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
       {user?.rol === 'keeper' && (
          <>
            <Route path="/cuidador/perfil" element={<Perfil />} />
            <Route path="/cuidador/Medicamentos" element={<MedicamentosCuidador />} />
            <Route path="/cuidador/Brazaletes" element={<Brazalete/>} />
            <Route path="/cuidador/Recordatorios" element={<Recordatorios/>} />
            <Route path="/cuidador/Contraseña" element={<Contraseña/>} />

          </>
        )}   

        {/* Redirigir si la ruta no existe o el usuario no tiene permisos */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
