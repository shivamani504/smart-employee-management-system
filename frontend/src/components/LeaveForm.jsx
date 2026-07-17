import { useState } from "react";
import { applyLeave } from "../services/leaveService";
import { useNotification } from "../context/NotificationContext";

function LeaveForm({ onClose }) {
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await applyLeave(formData);

      addNotification("Leave Applied Successfully");

      onClose();
    } catch (error) {
      console.log(error);

      addNotification("Leave Application Failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Apply Leave</h2>

        <input
          name="leaveType"
          placeholder="Leave Type"
          value={formData.leaveType}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
          }}
        />

        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
          }}
        />

        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
          }}
        />

        <textarea
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
          }}
        />

        <button
          onClick={handleSave}
          style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Apply
        </button>

        <button
          onClick={onClose}
          style={{
            marginLeft: "10px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LeaveForm;