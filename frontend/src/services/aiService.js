import axios from "axios";

const API = "http://localhost:5000/api/ai";

const getConfig = () => {
  return {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
};

// Send a chat message to the AI Copilot.
// history: array of { role: "user" | "model", text: string } from the current session
export const sendChatMessage = async (message, history) => {
  const response = await axios.post(
    `${API}/chat`,
    { message, history },
    getConfig()
  );

  return response.data;
};
