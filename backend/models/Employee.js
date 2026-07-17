const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  department: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Admin", "HR", "Employee"],
    default: "Employee",
  },

  password: {
    type: String,
    required: true,
  },

  salary: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);