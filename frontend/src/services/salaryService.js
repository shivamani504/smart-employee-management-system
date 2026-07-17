import axios from "axios";

const API = "http://localhost:5000/api/salary";

const getConfig = () => {
  return {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
};

// Get Salary
export const getSalaries = async () => {
  const response = await axios.get(API, getConfig());
  return response.data;
};

// Add Salary
export const addSalary = async (salaryData) => {
  const response = await axios.post(
    API,
    salaryData,
    getConfig()
  );

  return response.data;
};