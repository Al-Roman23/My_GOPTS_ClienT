// Import React
import React from "react";

// Import Authentication Hook
import useAuth from "../hooks/useAuth";

// Import Navigate And Use Location From React Router
import { Navigate, useLocation } from "react-router";

// Create Private Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show Loader While Authentication Is Loading
  if (loading) {
    return (
      <div>
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  // Redirect If User Is Not Logged In
  if (!user) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  return children;
};

export default PrivateRoute;
