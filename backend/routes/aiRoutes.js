const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { chatWithAI } = require("../controllers/aiController");

// All AI routes require a logged-in user, same as the rest of the app.
router.post("/chat", authMiddleware, chatWithAI);

module.exports = router;
