const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const User = require("../models/user");

// ================= APPLY LEAVE =================

const applyLeave = async (req, res) => {
  try {
    // Logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Find employee using email
    const employee = await Employee.findOne({
      email: user.email,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    const leave = new Leave({
      employeeId: employee._id,
      leaveType: req.body.leaveType,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      reason: req.body.reason,
      status: "Pending",
    });

    await leave.save();

    res.status(201).json({
      message: "Leave Applied Successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET LEAVES =================

const getAllLeaves = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Admin & HR -> View all
    if (user.role === "Admin" || user.role === "HR") {
      const leaves = await Leave.find().populate("employeeId");

      return res.status(200).json(leaves);
    }

    // Employee -> View only own leave
    const employee = await Employee.findOne({
      email: user.email,
    });

    const leaves = await Leave.find({
      employeeId: employee._id,
    }).populate("employeeId");

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE STATUS =================

const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave Not Found",
      });
    }

    res.status(200).json({
      message: "Leave Status Updated Successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
};