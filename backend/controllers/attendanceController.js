const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const User = require("../models/user");

// ================= MARK ATTENDANCE =================

const markAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);

    await attendance.save();

    res.status(201).json({
      message: "Attendance Marked Successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ATTENDANCE =================

const getAllAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // HR & Admin -> View all attendance
    if (user.role === "Admin" || user.role === "HR") {
      const attendance = await Attendance.find().populate("employeeId");

      return res.status(200).json(attendance);
    }

    // Employee -> View only own attendance
    const employee = await Employee.findOne({
      email: user.email,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    const attendance = await Attendance.find({
      employeeId: employee._id,
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET EMPLOYEE ATTENDANCE =================

const getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employeeId: req.params.employeeId,
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getEmployeeAttendance,
};