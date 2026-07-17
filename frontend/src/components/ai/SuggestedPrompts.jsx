import {
  FaCode,
  FaUsers,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";

const DEFAULT_PROMPTS = [
  {
    icon: <FaUsers />,
    title: "How many employees do we have?",
    subtitle: "Quick summary from live EMS data",
    prompt: "How many employees do we have, broken down by department?",
  },
  {
    icon: <FaChartBar />,
    title: "Summarize today's attendance",
    subtitle: "Present, absent and pending counts",
    prompt: "Summarize today's attendance across the company.",
  },
  {
    icon: <FaFileAlt />,
    title: "Draft a leave approval email",
    subtitle: "HR email writing help",
    prompt:
      "Write a professional email approving an employee's leave request for a family emergency.",
  },
  {
    icon: <FaCode />,
    title: "Explain a SQL JOIN",
    subtitle: "General programming help",
    prompt: "Explain the difference between INNER JOIN and LEFT JOIN with an example.",
  },
];

function SuggestedPrompts({ onSelect, prompts = DEFAULT_PROMPTS }) {
  return (
    <div className="copilot-prompts">
      {prompts.map((item, index) => (
        <button
          key={index}
          type="button"
          className="copilot-prompt-card"
          onClick={() => onSelect(item.prompt)}
        >
          <div className="copilot-prompt-card-icon">{item.icon}</div>
          <div className="copilot-prompt-card-title">{item.title}</div>
          <div className="copilot-prompt-card-sub">{item.subtitle}</div>
        </button>
      ))}
    </div>
  );
}

export default SuggestedPrompts;
