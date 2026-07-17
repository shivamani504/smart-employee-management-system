import { useEffect, useState } from "react";
import LeaveForm from "../components/LeaveForm";
import { getLeaves } from "../services/leaveService";

function MyLeave() {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getLeaves();
      setLeaves(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>My Leave</h1>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Apply Leave
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,.1)",
        }}
      >
        <thead
          style={{
            background: "#2563EB",
            color: "white",
          }}
        >
          <tr>
            <th style={{ padding: "12px" }}>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              style={{
                textAlign: "center",
                height: "55px",
              }}
            >
              <td>{leave.leaveType}</td>

              <td>
                {new Date(leave.fromDate).toLocaleDateString()}
              </td>

              <td>
                {new Date(leave.toDate).toLocaleDateString()}
              </td>

              <td>{leave.reason}</td>

              <td>
                <span
                  style={{
                    color:
                      leave.status === "Approved"
                        ? "green"
                        : leave.status === "Rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {leave.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <LeaveForm
          onClose={() => {
            setShowForm(false);
            fetchLeaves();
          }}
        />
      )}
    </div>
  );
}

export default MyLeave;