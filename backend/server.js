const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
console.log("Current API Key:", process.env.GEMINI_API_KEY);
console.log("Model:", process.env.GEMINI_MODEL || "default");
console.log("Current API Key:", process.env.GEMINI_API_KEY);
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes"); // ADD THIS
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes"); // AI FEATURES
console.log("Profile Routes Loaded");
const app = express();

const PORT = 5000;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // ADD THIS
app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes); // AI FEATURES
app.get("/test", (req, res) => {
    res.json({ message: "CORS Working" });
});

app.get("/", (req, res) => {

    res.send("Smart EMS Backend Running");

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});