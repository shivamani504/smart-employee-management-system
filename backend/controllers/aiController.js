const { getGeminiModel } = require("../config/gemini");
const { classifyIntent } = require("../services/aiIntentService");
const { getContextForIntent } = require("../services/aiRetrievalService");

// ------------------------------------------------------------------
// AI Copilot orchestration.
//
// Pipeline (all read-only):
//   1. classifyIntent()      -> figure out what the user is asking
//   2. getContextForIntent() -> run ONE small targeted DB query
//   3. Gemini                -> answer using only that small context
//
// This replaces the old approach of sending a fixed full-database
// summary on every message. General-knowledge questions never touch
// MongoDB at all (step 2 is skipped entirely).
// ------------------------------------------------------------------

const buildSystemInstruction = (role) => {
  return `You are "AI Copilot", the built-in AI assistant inside Smart EMS (Smart Employee Management System).

You have two jobs:
1. General assistant: Answer ANY question the user asks - programming, SQL, data science, AI, resume/career advice, general knowledge, mathematics, writing, emails, interview prep, etc. - the same way ChatGPT or Gemini would. Be clear, accurate, and helpful.
2. Smart EMS assistant: When the user asks about THIS project (employees, attendance, leave, payroll, departments), answer using ONLY the "EMS_RETRIEVED_DATA" JSON provided in the user's message, if present. That data was already fetched from the live database specifically for this question. Never invent numbers that aren't in it. If EMS_RETRIEVED_DATA is missing a detail you'd need (e.g. no matching employee, or no records for the requested range), say so plainly and ask the user to clarify or rephrase, rather than guessing.

Important rules:
- You are strictly READ-ONLY with respect to Smart EMS data. You can summarize, analyze, and explain data, but you must never claim to have created, updated, approved, rejected, or deleted any record. If asked to perform such an action, explain that you can only inform/suggest and that the change should be made from the relevant page in the app.
- The current user's role in the system is "${role || "Employee"}". Keep your tone professional and appropriate for a workplace HR/management tool.
- Format responses using Markdown (headings, lists, tables, code blocks) when it improves readability.
- Keep answers concise but complete.`;
};

// POST /api/ai/chat
// body: { message: string, history: [{ role: "user"|"model", text: string }] }
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const safeHistory = Array.isArray(history)
      ? history.filter(
          (h) => h && h.text && (h.role === "user" || h.role === "model")
        )
      : [];

    // Stage 1: what is the user asking about?
    const classification = await classifyIntent(message, safeHistory);

    // Stage 2: fetch only the relevant slice of data (skipped entirely
    // for general-knowledge questions).
    const context = classification.needsDatabase
      ? await getContextForIntent(classification)
      : null;
    console.log("Classification:", classification);
console.log("Context Size:", JSON.stringify(context).length);

    // Stage 3: answer using Gemini, grounded in that small context.
    const model = getGeminiModel(buildSystemInstruction(req.user?.role));

    const mappedHistory = safeHistory.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({ history: mappedHistory });

    const finalPrompt = context
      ? `${message}\n\n---\nEMS_RETRIEVED_DATA (read-only, fetched specifically for this question):\n${JSON.stringify(
          context
        )}`
      : message;

    const result = await chat.sendMessage(finalPrompt);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error) {
    if (error.code === "GEMINI_KEY_MISSING") {
      return res.status(503).json({
        message:
          "AI Copilot is not configured yet. Ask the administrator to add a valid GEMINI_API_KEY in backend/.env.",
      });
    }

    res.status(500).json({
      message:
        error.message || "Something went wrong while contacting the AI service.",
    });
  }
};

module.exports = {
  chatWithAI,
};
