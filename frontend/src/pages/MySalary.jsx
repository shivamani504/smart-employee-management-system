import { useEffect, useState } from "react";
import { getSalaries } from "../services/salaryService";

function MySalary() {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    try {
      const data = await getSalaries();
      setSalaries(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Salary</h1>

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
            <th style={{ padding: "12px" }}>Month</th>
            <th>Year</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Net Salary</th>
          </tr>
        </thead>

        <tbody>
          {salaries.map((salary) => (
            <tr
              key={salary._id}
              style={{
                textAlign: "center",
                height: "55px",
              }}
            >
              <td>{salary.month}</td>
              <td>{salary.year}</td>
              <td>₹{salary.basicSalary}</td>
              <td>₹{salary.bonus}</td>
              <td>₹{salary.deductions}</td>
              <td
                style={{
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                ₹{salary.netSalary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MySalary;