import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/dashboardService";
function Dashboard() {

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    presentToday: 0,
  });
  useEffect(() => {

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchStats();

}, []);

  return (
   <div>
  <h1>Smart EMS Dashboard</h1>

  <h2>Total Employees: {stats.totalEmployees}</h2>

  <h2>Total Leaves: {stats.totalLeaves}</h2>

  <h2>Approved Leaves: {stats.approvedLeaves}</h2>

  <h2>Rejected Leaves: {stats.rejectedLeaves}</h2>

  <h2>Present Today: {stats.presentToday}</h2>
</div>
  );
}
export default Dashboard;
