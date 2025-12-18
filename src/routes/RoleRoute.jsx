// Import Navigate From React Router
import { Navigate } from "react-router";

// Import User Role Hook
import useUserRole from "../hooks/useUserRole";

// Create Role Route Component
const RoleRoute = ({ children, allowed }) => {
  const { role, isLoading } = useUserRole();

  // Block Route Until Role Is Loaded
  if (isLoading) return null;

  // Redirect If User Role Is Not Allowed
  if (!allowed.includes(role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default RoleRoute;
