const { GoogleGenerativeAI } = require("@google/generative-ai");

// Central place for all AI features to get a configured Gemini model.
// Reads the key from .env so no key is ever hardcoded here.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let genAI = null;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    const error = new Error(
      "Gemini API key is not configured. Add GEMINI_API_KEY in backend/.env"
    );
    error.code = "GEMINI_KEY_MISSING";
    throw error;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
};

// systemInstruction lets each AI feature (chat, performance, leave, etc.)
// give Gemini a different persona/task without duplicating client setup.
// generationConfig is optional - e.g. { responseMimeType: "application/json" }
// for features (like intent classification) that need structured output.
const getGeminiModel = (systemInstruction, generationConfig) => {
  const client = getGeminiClient();

  return client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction,
    ...(generationConfig ? { generationConfig } : {}),
  });
};

module.exports = {
  getGeminiModel,
  GEMINI_MODEL,
};
