import axios from "axios";

const API = "http://localhost:5000/api/leave";

const getConfig = () => {
  return {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
};

// Get Leaves
export const getLeaves = async () => {
  const response = await axios.get(API, getConfig());
  return response.data;
};

// Apply Leave
export const applyLeave = async (leaveData) => {
  const response = await axios.post(
    API,
    leaveData,
    getConfig()
  );

  return response.data;
};

// Approve / Reject Leave
export const updateLeave = async (id, leaveData) => {
  const response = await axios.put(
    `${API}/${id}`,
    leaveData,
    getConfig()
  );

  return response.data;
};