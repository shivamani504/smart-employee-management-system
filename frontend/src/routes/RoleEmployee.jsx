import { Navigate } from "react-router-dom";

function RoleEmployee({ children }) {
  const role = localStorage.getItem("role");

  if (role === "Employee") {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
}

export default RoleEmployee;