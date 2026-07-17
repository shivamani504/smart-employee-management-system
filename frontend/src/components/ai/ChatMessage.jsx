import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRobot, FaUser, FaCopy, FaCheck } from "react-icons/fa";

// A code block with a small header + copy button, used inside AI messages.
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="copilot-code-block">
      <div className="copilot-code-header">
        <span>{language || "code"}</span>
        <button className="copilot-code-copy-btn" onClick={handleCopy} type="button">
          {copied ? <FaCheck /> : <FaCopy />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{ margin: 0, fontSize: "13px", padding: "14px" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function ChatMessage({ role, text, isStreaming }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";
  const isError = role === "error";

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`copilot-row ${isUser ? "user" : "ai"}`}>
      {!isUser && (
        <div className={`copilot-bubble-avatar ai`}>
          <FaRobot />
        </div>
      )}

      <div className="copilot-bubble-wrap">
        <div
          className={`copilot-bubble ${isUser ? "user" : isError ? "error" : "ai"}`}
        >
          {isUser ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeText = String(children).replace(/\n$/, "");

                    if (inline) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <CodeBlock
                        language={match ? match[1] : ""}
                        code={codeText}
                      />
                    );
                  },
                }}
              >
                {text}
              </ReactMarkdown>
              {isStreaming && <span className="copilot-cursor"></span>}
            </>
          )}
        </div>

        {!isUser && !isStreaming && text && (
          <div className="copilot-msg-actions">
            <button
              className="copilot-msg-copy-btn"
              onClick={handleCopyMessage}
              type="button"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied" : "Copy response"}
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="copilot-bubble-avatar user">
          <FaUser />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
