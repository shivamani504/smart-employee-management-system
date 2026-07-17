import { useEffect, useMemo, useState } from "react";
import AttendanceForm from "../components/AttendanceForm";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAttendance } from "../services/attendanceService";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialAttendance = async () => {
      try {
        setLoading(true);
        const data = await getAttendance();
        setAttendance(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredAttendance = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return attendance.filter((item) => {
      const employeeName = item.employeeId?.name || "";
      const itemDate = item.date ? new Date(item.date).toISOString().slice(0, 10) : "";

      const matchesSearch =
        !query || employeeName.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesDate = !dateFilter || itemDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendance, dateFilter, searchTerm, statusFilter]);

  return (
    <div className="management-page">
      <div className="management-header">
        <h1>Attendance</h1>

        <button
          className="primary-action"
          onClick={() => setShowForm(true)}
        >
          Mark Attendance
        </button>
      </div>

      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by employee name"
        resultCount={filteredAttendance.length}
        filters={[
          {
            name: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Status", value: "" },
              { label: "Present", value: "Present" },
              { label: "Absent", value: "Absent" },
            ],
          },
          {
            name: "date",
            label: "Date",
            value: dateFilter,
            onChange: setDateFilter,
            options: buildDateOptions(attendance),
          },
        ]}
      />

      {loading ? (
        <div className="loading-state">Loading attendance...</div>
      ) : filteredAttendance.length === 0 ? (
        <div className="empty-table-state">No attendance records match your filters.</div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map((item) => (
                <tr key={item._id}>
                  <td>{item.employeeId?.name || "-"}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${item.status?.toLowerCase().replace(" ", "-")}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <AttendanceForm
          onClose={() => {
            setShowForm(false);
            fetchAttendance();
          }}
        />
      )}
    </div>
  );
}

function buildDateOptions(attendance) {
  const dates = attendance
    .map((item) => (item.date ? new Date(item.date).toISOString().slice(0, 10) : ""))
    .filter(Boolean);

  return [
    { label: "All Dates", value: "" },
    ...[...new Set(dates)].sort().reverse().map((date) => ({
      label: new Date(date).toLocaleDateString(),
      value: date,
    })),
  ];
}

export default Attendance;
