import { useEffect, useMemo, useState } from "react";
import {
  deleteEmployee,
  getEmployees,
} from "../services/employeeServices";
import EmployeeForm from "../components/EmployeeForm";
import SearchFilterBar from "../components/SearchFilterBar";
import { useNotification } from "../context/NotificationContext";

function Employees() {
  const { addNotification } = useNotification();

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

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

  const departments = useMemo(() => {
    const uniqueDepartments = employees
      .map((employee) => employee.department)
      .filter(Boolean);

    return [...new Set(uniqueDepartments)].sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query);

      const matchesDepartment =
        !departmentFilter || employee.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [departmentFilter, employees, searchTerm]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);

      addNotification("Employee Deleted Successfully");

      fetchEmployees();
    } catch (error) {
      console.log(error);

      addNotification("Delete Failed");
    }
  };

  return (
    <div className="management-page">
      <div className="management-header">
        <h1>Employees</h1>

        <button
          className="primary-action"
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
        >
          Add Employee
        </button>
      </div>

      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by employee name or email"
        resultCount={filteredEmployees.length}
        filters={[
          {
            name: "department",
            label: "Department",
            value: departmentFilter,
            onChange: setDepartmentFilter,
            options: [
              { label: "All Departments", value: "" },
              ...departments.map((department) => ({
                label: department,
                value: department,
              })),
            ],
          },
        ]}
      />

      {loading ? (
        <div className="loading-state">Loading employees...</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="empty-table-state">No employees match your filters.</div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.role}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="action-button action-edit"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="action-button action-delete"
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => {
            setShowForm(false);
            setSelectedEmployee(null);
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}

export default Employees;
