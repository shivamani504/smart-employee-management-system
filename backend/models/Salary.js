const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  basicSalary: {
    type: Number,
    required: true,
  },

  bonus: {
    type: Number,
    default: 0,
  },

  deductions: {
    type: Number,
    default: 0,
  },

  month: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  netSalary: {
    type: Number,
    required: true,
  },

});

module.exports = mongoose.model("Salary", salarySchema);