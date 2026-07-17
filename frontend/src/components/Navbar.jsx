import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";

function Navbar() {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { notifications } = useNotification();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div
        style={{
          height: "70px",
          background: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        <h2 style={{ color: "#1E3A8A" }}>
          Employee Management System
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            position: "relative",
          }}
        >
          <div style={{ position: "relative" }}>
            <FaBell
              size={22}
              color="#555"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            />

            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {notifications.length}
            </span>

            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "35px",
                  width: "300px",
                  background: "white",
                  borderRadius: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,.2)",
                  padding: "10px",
                  zIndex: 1000,
                }}
              >
                <h4>Notifications</h4>

                <hr />

                {notifications.length === 0 ? (
                  <p>No Notifications</p>
                ) : (
                  notifications.map((note) => (
                    <p
                      key={note.id}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {note.message}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>

          <FaUserCircle
            size={34}
            color="#1E3A8A"
          />

          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              background: "#2563EB",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "350px",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,.2)",
            }}
          >
            <h2>Logout</h2>

            <p style={{ margin: "20px 0" }}>
              Are you sure you want to logout?
            </p>

            <button
              onClick={() => setShowLogoutModal(false)}
              style={{
                background: "#6B7280",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={logout}
              style={{
                background: "#EF4444",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;