import { useEffect, useState } from "react";
import SalaryForm from "../components/SalaryForm";
import { getSalaries } from "../services/salaryService";

function Salary() {
  const [salaries, setSalaries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const data = await getSalaries();
      setSalaries(data);
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
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1>Salary Management</h1>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add Salary
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
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
            <th style={{ padding: "15px" }}>Employee</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Month</th>
            <th>Year</th>
            <th>Net Salary</th>
          </tr>
        </thead>

        <tbody>
          {salaries.map((salary, index) => (
            <tr
              key={salary._id}
              style={{
                textAlign: "center",
                background: index % 2 === 0 ? "#fff" : "#f8fafc",
                height: "60px",
              }}
            >
              <td>{salary.employeeId?.name}</td>
              <td>₹{salary.basicSalary}</td>
              <td>₹{salary.bonus}</td>
              <td>₹{salary.deductions}</td>
              <td>{salary.month}</td>
              <td>{salary.year}</td>
              <td
                style={{
                  color: "#16A34A",
                  fontWeight: "bold",
                }}
              >
                ₹{salary.netSalary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <SalaryForm
          onClose={() => {
            setShowForm(false);
            fetchSalaries();
          }}
        />
      )}
    </div>
  );
}

export default Salary;