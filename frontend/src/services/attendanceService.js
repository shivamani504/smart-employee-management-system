import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance";

const getConfig = () => {
  return {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
};

// Get Attendance
export const getAttendance = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Mark Attendance
export const addAttendance = async (attendanceData) => {
  const response = await axios.post(
    API_URL,
    attendanceData,
    getConfig()
  );

  return response.data;
};

// Update Attendance
export const updateAttendance = async (id, attendanceData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    attendanceData,
    getConfig()
  );

  return response.data;
};

// Delete Attendance
export const deleteAttendance = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getConfig()
  );

  return response.data;
};