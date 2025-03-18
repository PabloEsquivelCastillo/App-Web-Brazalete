import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoutes() {
  const { user } = useAuth();
  return user?.rol === 'admin' ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminRoutes;
