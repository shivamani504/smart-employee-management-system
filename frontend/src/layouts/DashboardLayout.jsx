import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <div
          style={{
            padding: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;