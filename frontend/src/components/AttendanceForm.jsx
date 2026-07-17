import { useEffect, useState } from "react";
import { addAttendance } from "../services/attendanceService";
import { getEmployees } from "../services/employeeServices";
import { useNotification } from "../context/NotificationContext";

function AttendanceForm({ onClose }) {
  const { addNotification } = useNotification();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    status: "Present",
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
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

  const handleSave = async () => {
    try {
      await addAttendance(formData);

      addNotification("Attendance Marked Successfully");

      onClose();
    } catch (error) {
      console.log(error);

      addNotification("Failed to Add Attendance");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
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
          borderRadius: "10px",
        }}
      >
        <h2>Mark Attendance</h2>

        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
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
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
          }}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
          }}
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Half Day</option>
        </select>

        <input
          type="time"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
          }}
        />

        <input
          type="time"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "8px",
          }}
        />

        <button
          onClick={handleSave}
          style={{ marginRight: "10px" }}
        >
          Save
        </button>

        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AttendanceForm;