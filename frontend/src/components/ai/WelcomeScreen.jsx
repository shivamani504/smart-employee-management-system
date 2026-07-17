import { FaRobot } from "react-icons/fa";
import SuggestedPrompts from "./SuggestedPrompts";

function WelcomeScreen({ onSelectPrompt }) {
  return (
    <div className="copilot-welcome">
      <div className="copilot-welcome-icon">
        <FaRobot />
      </div>

      <h1>AI Copilot</h1>
      <p>
        Ask me anything - programming, writing, career advice, math, general
        knowledge - or ask about Smart EMS itself, like employee counts,
        attendance, leave, or payroll summaries.
      </p>

      <SuggestedPrompts onSelect={onSelectPrompt} />
    </div>
  );
}

export default WelcomeScreen;
