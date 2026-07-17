const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  markAttendance,
  getAllAttendance,
  getEmployeeAttendance,
} = require("../controllers/attendanceController");

// HR/Admin - Mark Attendance
router.post("/", authMiddleware, markAttendance);

// HR/Admin - View All
// Employee - View Own
router.get("/", authMiddleware, getAllAttendance);

// View Attendance By Employee Id
router.get("/:employeeId", authMiddleware, getEmployeeAttendance);

module.exports = router;