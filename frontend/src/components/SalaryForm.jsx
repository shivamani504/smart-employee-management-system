import { useEffect, useState } from "react";
import axios from "axios";
import { addSalary } from "../services/salaryService";
import { useNotification } from "../context/NotificationContext";

function SalaryForm({ onClose }) {
  const { addNotification } = useNotification();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    basicSalary: "",
    bonus: 0,
    deductions: 0,
    month: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const netSalary =
        Number(formData.basicSalary) +
        Number(formData.bonus) -
        Number(formData.deductions);

      console.log("Before API");

      await addSalary({
        ...formData,
        netSalary,
      });

      console.log("After API");

      addNotification("Salary Added Successfully");

      onClose();
    } catch (error) {
      console.log(error);

      addNotification("Failed to Add Salary");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          width: 420,
        }}
      >
        <h2>Add Salary</h2>

        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        >
          <option value="">Select Employee</option>

          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="basicSalary"
          placeholder="Basic Salary"
          value={formData.basicSalary}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <input
          type="number"
          name="bonus"
          placeholder="Bonus"
          value={formData.bonus}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <input
          type="number"
          name="deductions"
          placeholder="Deductions"
          value={formData.deductions}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <input
          type="text"
          name="month"
          placeholder="Month"
          value={formData.month}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Save Salary
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: 12,
            background: "#6B7280",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SalaryForm;