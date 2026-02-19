import { Navigate } from "react-router-dom";
import { getUserRole } from "./Auth";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
