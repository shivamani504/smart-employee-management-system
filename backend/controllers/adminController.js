const adminDashboard = (req, res) => {

    res.json({
        message: "Welcome Admin",
        user: req.user
    });

};

module.exports = { adminDashboard };