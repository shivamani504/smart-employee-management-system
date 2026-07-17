const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  addSalary,
  getAllSalaries,
} = require("../controllers/salaryController");

// Add Salary
router.post("/", authMiddleware, addSalary);

// Get Salaries
router.get("/", authMiddleware, getAllSalaries);

module.exports = router;