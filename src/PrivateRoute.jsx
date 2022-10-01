import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Provider/AuthProvider';

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;