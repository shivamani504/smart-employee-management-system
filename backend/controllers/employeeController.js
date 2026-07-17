const Employee = require("../models/Employee");

const addEmployee = async (req, res) => {

    try {

        const employee = new Employee(req.body);

        await employee.save();

        res.status(201).json({
            message: "Employee Added Successfully",
            employee
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getEmployees = async (req, res) => {

    try {

        const employees = await Employee.find();

        res.status(200).json(employees);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getEmployeeById = async (req, res) => {

    try {

        const employee = await Employee.findById(req.params.id);

        if (!employee) {

            return res.status(404).json({
                message: "Employee Not Found"
            });

        }

        res.status(200).json(employee);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateEmployee = async (req, res) => {

    try {

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!employee) {

            return res.status(404).json({
                message: "Employee Not Found"
            });

        }

        res.status(200).json({
            message: "Employee Updated Successfully",
            employee
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const deleteEmployee = async (req, res) => {

    try {

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {

            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        res.status(200).json({
            message: "Employee Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    addEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};