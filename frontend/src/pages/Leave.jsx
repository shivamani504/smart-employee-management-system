import { useEffect, useMemo, useState } from "react";
import LeaveForm from "../components/LeaveForm";
import SearchFilterBar from "../components/SearchFilterBar";
import {
  getLeaves,
  updateLeave,
} from "../services/leaveService";

function Leave() {
  const role = localStorage.getItem("role");

  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialLeaves = async () => {
      try {
        setLoading(true);
        const data = await getLeaves();
        setLeaves(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getLeaves();
      setLeaves(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredLeaves = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return leaves.filter((leave) => {
      const employeeName = leave.employeeId?.name || "";
      const matchesSearch =
        !query || employeeName.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || leave.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leaves, searchTerm, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await updateLeave(id, { status });

      alert("Leave Updated Successfully");

      fetchLeaves();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="management-page">
      <div className="management-header">
        <h1>{role === "Employee" ? "My Leave" : "Leave Requests"}</h1>

        {role === "Employee" && (
          <button
            className="primary-action"
            onClick={() => setShowForm(true)}
          >
            Apply Leave
          </button>
        )}
      </div>

      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by employee name"
        resultCount={filteredLeaves.length}
        filters={[
          {
            name: "status",
            label: "Leave Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Status", value: "" },
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ],
          },
        ]}
      />

      {loading ? (
        <div className="loading-state">Loading leave requests...</div>
      ) : filteredLeaves.length === 0 ? (
        <div className="empty-table-state">No leave requests match your filters.</div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                {role !== "Employee" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employeeId?.name || "-"}</td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${leave.status?.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>

                  {role !== "Employee" && (
                    <td>
                      <div className="row-actions">
                        <button
                          className="action-button action-approve"
                          onClick={() => updateStatus(leave._id, "Approved")}
                        >
                          Approve
                        </button>

                        <button
                          className="action-button action-reject"
                          onClick={() => updateStatus(leave._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default Leave;
