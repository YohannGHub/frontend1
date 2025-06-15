import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/authFetch';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  let isAuth = false;

  try {
    isAuth = isAuthenticated();
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    logout();
    return <Navigate to="/login" replace />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children ? children : <Outlet />}
    </>
  );
};

export default ProtectedRoute;
