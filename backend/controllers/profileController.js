const Employee = require("../models/Employee");
const User = require("../models/user");

const getProfile = async (req, res) => {
  try {
    // Logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // If Employee → fetch full employee details
    if (user.role === "Employee") {
      const employee = await Employee.findOne({
        email: user.email,
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee Not Found",
        });
      }

      return res.status(200).json(employee);
    }

    // Admin / HR profile
    return res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.role,
      salary: "-",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
};