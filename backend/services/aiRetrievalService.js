const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");

// ------------------------------------------------------------------
// Stage 2 of the AI Copilot pipeline: given the intent + entities
// extracted by aiIntentService, run ONE small, targeted, read-only
// query instead of loading the whole database.
//
// Every exported function here is READ-ONLY (.find / .countDocuments /
// .aggregate only - never .create/.update/.delete) and is written to
// be reused directly by future AI features (Performance Analyzer,
// Leave Recommendation, Attendance Insights, Dashboard Insights) so
// they all share this same data-access layer instead of duplicating
// queries.
// ------------------------------------------------------------------

const RECORD_CAP = 150;

// Finds an employee by a (possibly partial / misspelled-ish) name.
// Returns null if nothing matches - callers must handle that case
// rather than assuming a match.
const resolveEmployee = async (name) => {
  if (!name) return null;

  const employee = await Employee.findOne({
    name: { $regex: name.trim(), $options: "i" },
  }).select("name department role salary");

  return employee;
};

const resolveEmployees = async (name, department) => {
  const filter = {};
  if (name) filter.name = { $regex: name.trim(), $options: "i" };
  if (department) filter.department = { $regex: department.trim(), $options: "i" };

  return Employee.find(filter).select("name department role salary").limit(100);
};

// Builds a Mongo date-range filter. Treats a single "dateFrom" with no
// "dateTo" as a single-day query, and falls back to month/year when
// no explicit range is given.
const buildDateRange = ({ dateFrom, dateTo, month, year }) => {
  let start = null;
  let end = null;

  if (dateFrom || dateTo) {
    start = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    end = dateTo ? new Date(`${dateTo}T23:59:59`) : start
      ? new Date(`${dateFrom}T23:59:59`)
      : null;
  } else if (month && year) {
    start = new Date(year, month - 1, 1, 0, 0, 0);
    end = new Date(year, month, 0, 23, 59, 59);
  }

  if (!start || isNaN(start.getTime())) return null;
  if (!end || isNaN(end.getTime())) end = start;

  return { start, end };
};

// ---------------- Attendance ----------------

const getAttendanceContext = async (entities) => {
  const { employeeName, department } = entities;
  const range = buildDateRange(entities);

  const employee = employeeName ? await resolveEmployee(employeeName) : null;

  if (employeeName && !employee) {
    return {
      type: "attendance",
      note: `No employee found matching "${employeeName}".`,
      records: [],
    };
  }

  // Specific employee (optionally scoped to a date range)
  if (employee) {
    const filter = { employeeId: employee._id };
    if (range) filter.date = { $gte: range.start, $lte: range.end };

    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .limit(RECORD_CAP)
      .select("date status checkIn checkOut -_id");

    const summary = records.reduce(
      (acc, r) => {
        if (r.status === "Present") acc.present++;
        else if (r.status === "Absent") acc.absent++;
        else if (r.status === "Half Day") acc.halfDay++;
        return acc;
      },
      { present: 0, absent: 0, halfDay: 0 }
    );

    return {
      type: "attendance",
      employee: { name: employee.name, department: employee.department },
      dateRange: range ? { from: range.start, to: range.end } : "all records on file",
      totalRecords: records.length,
      summary,
      records,
    };
  }

  // No specific employee named - either a date-range-wide query or a
  // "which department has the best attendance" style comparison.
  const dateFilter = range ? { date: { $gte: range.start, $lte: range.end } } : {};

  const matchStage = { $match: dateFilter };
  const deptStats = await Attendance.aggregate([
    matchStage,
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    ...(department
      ? [{ $match: { "employee.department": { $regex: department, $options: "i" } } }]
      : []),
    {
      $group: {
        _id: "$employee.department",
        totalRecords: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
        },
        halfDay: {
          $sum: { $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        department: "$_id",
        totalRecords: 1,
        present: 1,
        absent: 1,
        halfDay: 1,
        presentRate: {
          $round: [
            { $multiply: [{ $divide: ["$present", "$totalRecords"] }, 100] },
            1,
          ],
        },
      },
    },
    { $sort: { presentRate: -1 } },
  ]);

  return {
    type: "attendance",
    scope: department ? `department: ${department}` : "all departments",
    dateRange: range ? { from: range.start, to: range.end } : "all records on file",
    departmentStats: deptStats,
  };
};

// ---------------- Leave ----------------

const getLeaveContext = async (entities) => {
  const { employeeName, leaveType, status } = entities;
  const range = buildDateRange(entities);

  const employee = employeeName ? await resolveEmployee(employeeName) : null;

  if (employeeName && !employee) {
    return {
      type: "leave",
      note: `No employee found matching "${employeeName}".`,
      records: [],
    };
  }

  const filter = {};
  if (employee) filter.employeeId = employee._id;
  if (leaveType) filter.leaveType = { $regex: leaveType, $options: "i" };
  if (status) filter.status = { $regex: `^${status}$`, $options: "i" };
  if (range) {
    // A leave "overlaps" the requested range if it starts before the
    // range ends and ends after the range starts.
    filter.fromDate = { $lte: range.end };
    filter.toDate = { $gte: range.start };
  }

  const query = Leave.find(filter).sort({ fromDate: -1 }).limit(RECORD_CAP);
  if (!employee) query.populate("employeeId", "name department");

  const records = await query.select(
    "employeeId leaveType fromDate toDate reason status -_id"
  );

  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return {
    type: "leave",
    employee: employee ? { name: employee.name, department: employee.department } : null,
    dateRange: range ? { from: range.start, to: range.end } : "all records on file",
    totalRecords: records.length,
    statusCounts,
    records: records.map((r) =>
      employee
        ? r
        : {
            employee: r.employeeId?.name || "Unknown",
            department: r.employeeId?.department || "Unknown",
            leaveType: r.leaveType,
            fromDate: r.fromDate,
            toDate: r.toDate,
            status: r.status,
            reason: r.reason,
          }
    ),
  };
};

// ---------------- Salary ----------------

const getSalaryContext = async (entities) => {
  const { employeeName, month, year } = entities;

  const employee = employeeName ? await resolveEmployee(employeeName) : null;

  if (employeeName && !employee) {
    return {
      type: "salary",
      note: `No employee found matching "${employeeName}".`,
      records: [],
    };
  }

  const filter = {};
  if (employee) filter.employeeId = employee._id;
  if (month) filter.month = { $regex: `^${month}$`, $options: "i" };
  if (year) filter.year = year;

  const query = Salary.find(filter).sort({ year: -1 }).limit(RECORD_CAP);
  if (!employee) query.populate("employeeId", "name department");

  const records = await query.select(
    "employeeId basicSalary bonus deductions netSalary month year -_id"
  );

  if (employee) {
    return {
      type: "salary",
      employee: { name: employee.name, department: employee.department },
      totalRecords: records.length,
      records,
    };
  }

  const allEmployees = await Employee.find().select("salary -_id");
  const monthlyPayroll = allEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);

  return {
    type: "salary",
    monthlyPayroll,
    totalRecords: records.length,
    records: records.map((r) => ({
      employee: r.employeeId?.name || "Unknown",
      department: r.employeeId?.department || "Unknown",
      basicSalary: r.basicSalary,
      bonus: r.bonus,
      deductions: r.deductions,
      netSalary: r.netSalary,
      month: r.month,
      year: r.year,
    })),
  };
};

// ---------------- Employee ----------------

const getEmployeeContext = async (entities) => {
  const { employeeName, department } = entities;

  const employees = await resolveEmployees(employeeName, department);

  const departmentBreakdown = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  return {
    type: "employee",
    totalMatched: employees.length,
    departmentBreakdown,
    employees: employees.map((e) => ({
      name: e.name,
      department: e.department,
      role: e.role,
    })),
  };
};

// ---------------- Dashboard (company-wide overview) ----------------
// Mirrors the same figures shown on the existing Admin dashboard so
// the AI's summary always matches what's on screen.

const getDashboardContext = async () => {
  const totalEmployees = await Employee.countDocuments();
  const employees = await Employee.find().select("salary department -_id");
  const monthlyPayroll = employees.reduce((total, e) => total + (e.salary || 0), 0);
  const onLeave = await Leave.countDocuments({ status: "Approved" });
  const presentToday = await Attendance.countDocuments({ status: "Present" });
  const pendingLeaves = await Leave.countDocuments({ status: "Pending" });

  const departmentBreakdown = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  return {
    type: "dashboard",
    totalEmployees,
    monthlyPayroll,
    onLeave,
    pendingLeaves,
    presentToday,
    departmentBreakdown,
  };
};

// ---------------- Dispatcher ----------------

const getContextForIntent = async (classification) => {
  switch (classification.intent) {
    case "attendance":
      return getAttendanceContext(classification);
    case "leave":
      return getLeaveContext(classification);
    case "salary":
      return getSalaryContext(classification);
    case "employee":
      return getEmployeeContext(classification);
    case "dashboard":
      return getDashboardContext();
    default:
      return null;
  }
};

module.exports = {
  resolveEmployee,
  resolveEmployees,
  getAttendanceContext,
  getLeaveContext,
  getSalaryContext,
  getEmployeeContext,
  getDashboardContext,
  getContextForIntent,
};
