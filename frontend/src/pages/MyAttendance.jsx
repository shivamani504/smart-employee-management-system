import { useEffect, useState } from "react";
import { getAttendance } from "../services/attendanceService";

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Attendance</h1>

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
            <th style={{ padding: "12px" }}>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((item) => (
            <tr
              key={item._id}
              style={{
                textAlign: "center",
                height: "55px",
              }}
            >
              <td>
                {new Date(item.date).toLocaleDateString()}
              </td>

              <td>{item.status}</td>

              <td>{item.checkIn || "-"}</td>

              <td>{item.checkOut || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyAttendance;