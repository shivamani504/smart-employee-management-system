const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

// Employee applies leave
router.post("/", authMiddleware, applyLeave);

// Get leave records
router.get("/", authMiddleware, getAllLeaves);

// HR/Admin approve or reject leave
router.put("/:id", authMiddleware, updateLeaveStatus);

module.exports = router;