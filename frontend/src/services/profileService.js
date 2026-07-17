import axios from "axios";

const API = "http://localhost:5000/api/profile";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};