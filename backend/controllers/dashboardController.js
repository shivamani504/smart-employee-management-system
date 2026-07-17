const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");
const getDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const employees = await Employee.find();

const monthlyPayroll = employees.reduce(
  (total, employee) => total + employee.salary,
  0
);
const onLeave = await Leave.countDocuments({
  status: "Approved",
});
const presentToday = await Attendance.countDocuments({
  status: "Present",
});
console.log("Present Today:", presentToday);
 res.status(200).json({
  totalEmployees,
  monthlyPayroll,
  onLeave,
presentToday,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};