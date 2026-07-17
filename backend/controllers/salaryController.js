const Salary = require("../models/Salary");
const Employee = require("../models/Employee");
const User = require("../models/user");

// ================= ADD SALARY =================

const addSalary = async (req, res) => {
  try {
    const salary = new Salary(req.body);

    await salary.save();

    res.status(201).json({
      message: "Salary Added Successfully",
      salary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SALARIES =================

const getAllSalaries = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("Logged User:", user);  
    console.log("Role:", user.role);

    if (!user) {  
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Admin & HR -> View all salaries
    if (user.role === "Admin" || user.role === "HR") {
      const salaries = await Salary.find().populate("employeeId");

      return res.status(200).json(salaries);
    }

    // Employee -> View only own salary
    const employee = await Employee.findOne({
      email: user.email,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    const salaries = await Salary.find({
      employeeId: employee._id,
    }).populate("employeeId");

    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addSalary,
  getAllSalaries,
};