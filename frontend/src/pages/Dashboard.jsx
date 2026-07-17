import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  FaCalendarAlt,
  FaChartLine,
  FaClipboardList,
  FaMoneyBillWave,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import { getAttendance } from "../services/attendanceService";
import { getDashboard } from "../services/dashboardService";
import { getEmployees } from "../services/employeeServices";
import { getLeaves } from "../services/leaveService";
import { getSalaries } from "../services/salaryService";
import "../styles/dashboard.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
      },
    },
  },
};

const getLatestFive = (items) => [...items].slice(-5).reverse();

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    monthlyPayroll: 0,
    presentToday: 0,
    onLeave: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        getDashboard(),
        getEmployees(),
        getLeaves(),
        getAttendance(),
        getSalaries(),
      ]);

      if (results[0].status === "fulfilled") {
        setStats(results[0].value);
      } else {
        setError("Dashboard statistics could not be loaded.");
      }

      setEmployees(results[1].status === "fulfilled" ? results[1].value : []);
      setLeaves(results[2].status === "fulfilled" ? results[2].value : []);
      setAttendance(results[3].status === "fulfilled" ? results[3].value : []);
      setSalaries(results[4].status === "fulfilled" ? results[4].value : []);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const attendanceOverview = useMemo(() => {
    const totals = {
      Present: 0,
      Absent: 0,
      "Half Day": 0,
    };

    attendance.forEach((item) => {
      if (totals[item.status] !== undefined) {
        totals[item.status] += 1;
      }
    });

    return totals;
  }, [attendance]);

  const leaveOverview = useMemo(() => {
    const totals = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };

    leaves.forEach((leave) => {
      if (totals[leave.status] !== undefined) {
        totals[leave.status] += 1;
      }
    });

    return totals;
  }, [leaves]);

  const payrollOverview = useMemo(() => {
    const totals = salaries.reduce((acc, salary) => {
      const label = `${salary.month} ${salary.year}`;
      acc[label] = (acc[label] || 0) + Number(salary.netSalary || 0);
      return acc;
    }, {});

    return Object.entries(totals).slice(-6);
  }, [salaries]);

  const summaryCards = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: <FaUsers />,
      tone: "blue",
      detail: "Active workforce records",
    },
    {
      label: "Present Today",
      value: stats.presentToday,
      icon: <FaUserCheck />,
      tone: "green",
      detail: "Attendance marked present",
    },
    {
      label: "Employees On Leave",
      value: stats.onLeave,
      icon: <FaCalendarAlt />,
      tone: "amber",
      detail: "Approved leave requests",
    },
    {
      label: "Monthly Payroll",
      value: currencyFormatter.format(Number(stats.monthlyPayroll || 0)),
      icon: <FaMoneyBillWave />,
      tone: "rose",
      detail: "Total monthly salary cost",
    },
  ];

  const attendanceData = {
    labels: Object.keys(attendanceOverview),
    datasets: [
      {
        label: "Attendance",
        data: Object.values(attendanceOverview),
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const leaveData = {
    labels: Object.keys(leaveOverview),
    datasets: [
      {
        label: "Leaves",
        data: Object.values(leaveOverview),
        backgroundColor: ["#f59e0b", "#2563eb", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  const payrollData = {
    labels: payrollOverview.map(([label]) => label),
    datasets: [
      {
        label: "Net Salary",
        data: payrollOverview.map(([, total]) => total),
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.14)",
        pointBackgroundColor: "#7c3aed",
        pointBorderWidth: 0,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const recentEmployees = getLatestFive(employees);
  const recentLeaves = getLatestFive(leaves);
  const hasAttendanceData = Object.values(attendanceOverview).some(Boolean);
  const hasLeaveData = Object.values(leaveOverview).some(Boolean);
  const hasPayrollData = payrollOverview.length > 0;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner" />
          <p>Loading dashboard insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-kicker">Smart EMS Overview</span>
          <h1>Dashboard</h1>
          <p>Track workforce, attendance, leave, and payroll performance.</p>
        </div>

        <div className="dashboard-header-badge">
          <FaChartLine />
          <span>Live system data</span>
        </div>
      </div>

      {error && <div className="dashboard-alert">{error}</div>}

      <section className="dashboard-stats-grid" aria-label="Dashboard statistics">
        {summaryCards.map((card) => (
          <article className={`stat-card stat-card-${card.tone}`} key={card.label}>
            <div>
              <p>{card.label}</p>
              <h2>{card.value}</h2>
              <span>{card.detail}</span>
            </div>
            <div className="stat-icon">{card.icon}</div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid dashboard-grid-charts">
        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Attendance Overview</h3>
              <p>Current records by attendance status</p>
            </div>
          </div>

          <div className="chart-box">
            {hasAttendanceData ? (
              <Doughnut data={attendanceData} options={chartOptions} />
            ) : (
              <EmptyState title="No attendance records yet" />
            )}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Leave Overview</h3>
              <p>Requests grouped by approval status</p>
            </div>
          </div>

          <div className="chart-box">
            {hasLeaveData ? (
              <Bar data={leaveData} options={chartOptions} />
            ) : (
              <EmptyState title="No leave requests yet" />
            )}
          </div>
        </article>

        <article className="dashboard-panel dashboard-panel-wide">
          <div className="panel-header">
            <div>
              <h3>Payroll Overview</h3>
              <p>Net salary totals from available payroll records</p>
            </div>
          </div>

          <div className="chart-box chart-box-wide">
            {hasPayrollData ? (
              <Line data={payrollData} options={chartOptions} />
            ) : (
              <EmptyState title="No salary records yet" />
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid-lists">
        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Employees</h3>
              <p>Latest 5 employee records</p>
            </div>
            <Link className="view-all-link" to="/employees">
              View All
            </Link>
          </div>

          {recentEmployees.length > 0 ? (
            <div className="record-list">
              {recentEmployees.map((employee) => (
                <div className="record-item" key={employee._id}>
                  <div className="record-avatar">
                    {employee.name?.charAt(0)?.toUpperCase() || "E"}
                  </div>
                  <div>
                    <h4>{employee.name}</h4>
                    <p>{employee.department || "Department not set"}</p>
                  </div>
                  <span className="record-pill">{employee.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No employees found" />
          )}
        </article>

        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Leave Requests</h3>
              <p>Latest 5 leave entries</p>
            </div>
            <Link className="view-all-link" to="/leave">
              View All
            </Link>
          </div>

          {recentLeaves.length > 0 ? (
            <div className="record-list">
              {recentLeaves.map((leave) => (
                <div className="record-item" key={leave._id}>
                  <div className="record-avatar leave-avatar">
                    <FaClipboardList />
                  </div>
                  <div>
                    <h4>{leave.employeeId?.name || "Employee"}</h4>
                    <p>
                      {leave.leaveType} · {formatDate(leave.fromDate)}
                    </p>
                  </div>
                  <span className={`status-pill status-${leave.status?.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No leave requests found" />
          )}
        </article>
      </section>
    </div>
  );
}

function EmptyState({ title }) {
  return (
    <div className="empty-state">
      <p>{title}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "Date not set";
  }

  return dateFormatter.format(new Date(value));
}

export default Dashboard;
