import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;