import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Salary from "../pages/Salary";
import Profile from "../pages/Profile";
import AICopilot from "../pages/AICopilot";

import MyAttendance from "../pages/MyAttendance";
import MyLeave from "../pages/MyLeave";
import MySalary from "../pages/MySalary";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import HRRoute from "./HRRoute";
import RoleEmployee from "./RoleEmployee";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Employees */}
          <Route
            path="/employees"
            element={
              <HRRoute>
                <Employees />
              </HRRoute>
            }
          />

          {/* HR/Admin Attendance */}
          <Route
            path="/attendance"
            element={
              <HRRoute>
                <Attendance />
              </HRRoute>
            }
          />

          {/* Employee Attendance */}
          <Route
            path="/my-attendance"
            element={
              <RoleEmployee>
                <MyAttendance />
              </RoleEmployee>
            }
          />

          {/* HR/Admin Leave */}
          <Route
            path="/leave"
            element={
              <HRRoute>
                <Leave />
              </HRRoute>
            }
          />

          {/* Employee Leave */}
          <Route
            path="/my-leave"
            element={
              <RoleEmployee>
                <MyLeave />
              </RoleEmployee>
            }
          />

          {/* HR/Admin Salary */}
          <Route
            path="/salary"
            element={
              <HRRoute>
                <Salary />
              </HRRoute>
            }
          />

          {/* Employee Salary */}
          <Route
            path="/my-salary"
            element={
              <RoleEmployee>
                <MySalary />
              </RoleEmployee>
            }
          />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* AI Copilot */}
          <Route path="/ai-copilot" element={<AICopilot />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;