const { getGeminiModel } = require("../config/gemini");

// ------------------------------------------------------------------
// Stage 1 of the AI Copilot pipeline: figure out WHAT the user is
// asking about before touching the database at all.
//
// This never queries MongoDB - it only asks Gemini to classify the
// question and pull out useful entities (employee name, dates, etc).
// Stage 2 (aiRetrievalService) then uses this to run a small, targeted
// read-only query instead of dumping the whole database into every
// prompt.
// ------------------------------------------------------------------

const VALID_INTENTS = [
  "attendance",
  "employee",
  "leave",
  "salary",
  "dashboard",
  "general",
];

const CLASSIFIER_INSTRUCTION = `You are an intent classifier for Smart EMS, an Employee Management System.

Read the user's message (and recent conversation, if any) and output ONLY a single JSON object - no prose, no markdown fences - describing what they're asking for.

Schema:
{
  "intent": one of "attendance" | "employee" | "leave" | "salary" | "dashboard" | "general",
  "needsDatabase": boolean,
  "employeeName": string or null,
  "department": string or null,
  "dateFrom": "YYYY-MM-DD" or null,
  "dateTo": "YYYY-MM-DD" or null,
  "month": number (1-12) or null,
  "year": number or null,
  "leaveType": string or null,
  "status": string or null
}

Rules:
- "attendance": presence/absence, check-in/out, attendance patterns or comparisons (e.g. "was X present", "attendance between two dates", "which department has the best attendance").
- "employee": questions about employee records themselves - counts, who works where, department rosters, employee details.
- "leave": leave requests, leave counts, leave approvals/rejections, leave balance/history.
- "salary": payroll, salary, bonus, deductions, net salary questions.
- "dashboard": broad company-wide overview / summary requests ("give me a dashboard summary", "overview of the company").
- "general": anything NOT about this project's data - programming, writing, career advice, math, general knowledge, emails, etc. For "general", set needsDatabase to false and leave all other fields null.
- Resolve relative dates ("today", "this month", "July 3", "last week") into absolute values using the CURRENT_DATE given below. If a year isn't stated, assume the current year.
- If the user names a person, put their name (as written) in employeeName.
- If a field isn't mentioned or can't be determined, use null. Never invent data.
- Output raw JSON only, matching the schema exactly.`;

const buildClassifierModel = () =>
  getGeminiModel(CLASSIFIER_INSTRUCTION, { responseMimeType: "application/json" });

const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: strip any stray markdown fences and retry once.
    const cleaned = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
};

const FALLBACK_INTENT = {
  intent: "general",
  needsDatabase: false,
  employeeName: null,
  department: null,
  dateFrom: null,
  dateTo: null,
  month: null,
  year: null,
  leaveType: null,
  status: null,
};

// history: last few { role, text } turns, used so follow-up questions
// ("what about last week?") can still be classified correctly.
const classifyIntent = async (message, history = []) => {
  const model = buildClassifierModel();
  const today = new Date().toISOString().split("T")[0];

  const recentTurns = history
    .slice(-4)
    .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
    .join("\n");

  const prompt = `CURRENT_DATE: ${today}\n\n${
    recentTurns ? `Recent conversation:\n${recentTurns}\n\n` : ""
  }Classify this message:\n"${message}"`;

  const result = await model.generateContent(prompt);
  const parsed = safeParseJSON(result.response.text());

  if (!parsed || !VALID_INTENTS.includes(parsed.intent)) {
    return FALLBACK_INTENT;
  }

  return { ...FALLBACK_INTENT, ...parsed };
};

module.exports = {
  classifyIntent,
  VALID_INTENTS,
};
