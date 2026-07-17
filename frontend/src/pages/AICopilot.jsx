import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaPlus, FaTrash, FaRobot } from "react-icons/fa";

import ChatMessage from "../components/ai/ChatMessage";
import TypingIndicator from "../components/ai/TypingIndicator";
import WelcomeScreen from "../components/ai/WelcomeScreen";
import { sendChatMessage } from "../services/aiService";
import "../styles/aiCopilot.css";

let idCounter = 0;
const nextId = () => `msg-${Date.now()}-${idCounter++}`;

function AICopilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const streamIntervalRef = useRef(null);

  // Auto-scroll to the latest message whenever the conversation changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  // Clean up any in-progress streaming animation on unmount.
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  useEffect(autoResizeTextarea, [input]);

  // Reveals the AI's reply progressively for a streaming-like feel,
  // even though the backend returns the full response in one call.
  const streamReply = (fullText, messageId) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    let index = 0;
    const totalSteps = 90;
    const chunkSize = Math.max(1, Math.ceil(fullText.length / totalSteps));

    streamIntervalRef.current = setInterval(() => {
      index += chunkSize;
      const partial = fullText.slice(0, index);

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text: partial } : m))
      );

      if (index >= fullText.length) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, text: fullText, streaming: false } : m
          )
        );
      }
    }, 12);
  };

  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isWaiting) return;

    const history = messages
      .filter((m) => m.role === "user" || m.role === "model")
      .map((m) => ({ role: m.role, text: m.text }));

    const userMessage = { id: nextId(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsWaiting(true);

    try {
      const data = await sendChatMessage(text, history);
      const aiMessageId = nextId();

      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, role: "model", text: "", streaming: true },
      ]);
      setIsWaiting(false);
      streamReply(data.reply || "", aiMessageId);
    } catch (error) {
      setIsWaiting(false);
      const message =
        error?.response?.data?.message ||
        "Something went wrong while reaching the AI service. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "error", text: message },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setMessages([]);
    setIsWaiting(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="copilot-page">
      <div className="copilot-header">
        <div className="copilot-header-title">
          <div className="copilot-avatar">
            <FaRobot />
          </div>
          <div>
            <h2>AI Copilot</h2>
            <span>Powered by Google Gemini</span>
          </div>
        </div>

        <div className="copilot-header-actions">
          <button className="copilot-btn" onClick={clearConversation} type="button">
            <FaTrash />
            <span>Clear Chat</span>
          </button>
          <button
            className="copilot-btn copilot-btn-primary"
            onClick={clearConversation}
            type="button"
          >
            <FaPlus />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      <div className="copilot-messages">
        {messages.length === 0 && !isWaiting ? (
          <WelcomeScreen onSelectPrompt={(p) => handleSend(p)} />
        ) : (
          <>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                text={m.text}
                isStreaming={m.streaming}
              />
            ))}

            {isWaiting && (
              <div className="copilot-row ai">
                <div className="copilot-bubble-avatar ai">
                  <FaRobot />
                </div>
                <div className="copilot-bubble-wrap">
                  <div className="copilot-bubble ai" style={{ padding: 0 }}>
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="copilot-input-bar">
        <div className="copilot-input-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Message AI Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="copilot-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isWaiting}
            type="button"
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
        <div className="copilot-input-hint">
          Enter to send &middot; Shift + Enter for a new line
        </div>
      </div>
    </div>
  );
}

export default AICopilot;
