import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaUserCircle,
  FaRobot,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const role = localStorage.getItem("role");

  let menuItems = [];

  // ---------------- ADMIN ----------------
  if (role === "Admin") {
    menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Employees", path: "/employees", icon: <FaUsers /> },
      { name: "Attendance", path: "/attendance", icon: <FaCalendarCheck /> },
      { name: "Leave Requests", path: "/leave", icon: <FaClipboardList /> },
      { name: "Salary", path: "/salary", icon: <FaMoneyCheckAlt /> },
      { name: "Profile", path: "/profile", icon: <FaUserCircle /> },
      { name: "AI Copilot", path: "/ai-copilot", icon: <FaRobot /> },
    ];
  }

  // ---------------- HR ----------------
  else if (role === "HR") {
    menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Employees", path: "/employees", icon: <FaUsers /> },
      { name: "Attendance", path: "/attendance", icon: <FaCalendarCheck /> },
      { name: "Leave Requests", path: "/leave", icon: <FaClipboardList /> },
      { name: "Salary", path: "/salary", icon: <FaMoneyCheckAlt /> },
      { name: "Profile", path: "/profile", icon: <FaUserCircle /> },
      { name: "AI Copilot", path: "/ai-copilot", icon: <FaRobot /> },
    ];
  }

  // ---------------- EMPLOYEE ----------------
  else {
  menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "My Attendance", path: "/my-attendance", icon: <FaCalendarCheck /> },
    { name: "Apply Leave", path: "/my-leave", icon: <FaClipboardList /> },
    { name: "My Salary", path: "/my-salary", icon: <FaMoneyCheckAlt /> },
    { name: "Profile", path: "/profile", icon: <FaUserCircle /> },
    { name: "AI Copilot", path: "/ai-copilot", icon: <FaRobot /> },
  ];
}
  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#1E3A8A",
        color: "white",
        padding: "20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "35px",
        }}
      >
        Smart EMS
      </h2>

      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            textDecoration: "none",
            color: "white",
            padding: "14px",
            marginBottom: "10px",
            borderRadius: "10px",
            background:
              location.pathname === item.path
                ? "#2563EB"
                : "transparent",
            transition: "0.3s",
          }}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;