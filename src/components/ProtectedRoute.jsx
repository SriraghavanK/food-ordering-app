import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, restaurantOnly = false }) => {
  const { user } = useAuth();
  const isRestaurant = localStorage.getItem("isRestaurant") === "true";

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  if (restaurantOnly && !isRestaurant) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;