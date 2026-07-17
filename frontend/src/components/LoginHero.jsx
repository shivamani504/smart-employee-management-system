import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyCheckAlt,
  FaClipboardList,
} from "react-icons/fa";

function LoginHero() {
  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    monthlyPayroll: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/dashboard"
      );

      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-hero">
      <div className="hero-content">
        <h1>Smart EMS</h1>

        <h2>Employee Management System</h2>

        <p>
          Manage Employees, Attendance,
          <br />
          Leave and Salary from one place.
        </p>

        <div className="stats-grid">
          {/* Employees */}
          <div className="stats-card">
            <FaUsers className="icon" />
            <h3>{dashboard.totalEmployees}</h3>
            <span>Total Employees</span>
          </div>

          {/* Attendance */}
          <div className="stats-card">
            <FaCalendarCheck className="icon" />
            <h3>{dashboard.presentToday}</h3>
            <span>Present Today</span>
          </div>

          {/* Leave */}
          <div className="stats-card">
            <FaClipboardList className="icon" />
            <h3>{dashboard.onLeave}</h3>
            <span>Employees On Leave</span>
          </div>

          {/* Payroll */}
          <div className="stats-card">
            <FaMoneyCheckAlt className="icon" />
            <h3>
              ₹{dashboard.monthlyPayroll.toLocaleString("en-IN")}
            </h3>
            <span>Monthly Payroll</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginHero;