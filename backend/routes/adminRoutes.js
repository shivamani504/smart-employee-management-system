const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { adminDashboard } = require("../controllers/adminController");

router.get("/dashboard", authMiddleware, adminDashboard);

module.exports = router;