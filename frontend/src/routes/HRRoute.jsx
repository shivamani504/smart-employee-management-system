import { Navigate } from "react-router-dom";

function HRRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role === "Admin" || role === "HR") {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
}

export default HRRoute;