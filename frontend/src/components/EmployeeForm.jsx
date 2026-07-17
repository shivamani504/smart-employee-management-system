import { useState, useEffect } from "react";
import { addEmployee, updateEmployee } from "../services/employeeServices";
import { useNotification } from "../context/NotificationContext"; 
function EmployeeForm({ onClose ,employee}) {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "Employee",
    password: "",
    salary: "",
  });
  useEffect(() => {
  if (employee) {
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      password: employee.password || "",
      salary: employee.salary,
    });
  }
}, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleSave = async () => {
  try {
    if (employee) {
      await updateEmployee(employee._id, formData);
      addNotification("Employee Updated Successfully");
    } else {
      await addEmployee(formData);
      addNotification("Employee Added Successfully");
    }

    onClose();
  } catch (error) {
    console.log(error);
    alert("Operation Failed");
  }
};
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option>Employee</option>
          <option>HR</option>
          <option>Admin</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />

       <button
  onClick={handleSave}
  style={{ marginRight: "10px" }}
>
  {employee ? "Update" : "Save"}
</button>

        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;