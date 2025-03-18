import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CuidadorRoutes() {
  const { user } = useAuth();
  return user?.rol === 'cuidador' ? <Outlet /> : <Navigate to="/login" />;
}

export default CuidadorRoutes;