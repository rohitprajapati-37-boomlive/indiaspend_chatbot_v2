import React, { useState, useEffect, useRef } from "react";
import "../styles/Footer.css";
import { MdSend, MdInfo, MdClose } from "react-icons/md";

const Footer = ({ onSubmitQuestion, onLoading }) => {
  const [question, setQuestion] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const footerRef = useRef(null);
  const disclaimerRef = useRef(null);

  const handleAskQuestion = () => {
    if (!question.trim()) {
      alert("Please enter a question before submitting!");
      return;
    }
    onSubmitQuestion(question);
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskQuestion();
    }
  };

  // Close disclaimer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        disclaimerRef.current &&
        !disclaimerRef.current.contains(event.target) &&
        !footerRef.current.contains(event.target)
      ) {
        setShowDisclaimer(false);
      }
    };

    if (showDisclaimer) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDisclaimer]);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        <div>
          <h2>Got a Question? Get Expert Answers!</h2>
          <p>
            Ask a data-driven question, and our experts will get back to you.
          </p>
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Ask something here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={onLoading}
          />
          <button
            type="submit"
            className="send-btn"
            onClick={handleAskQuestion}
            disabled={onLoading || question === ""}
          >
            <MdSend />
          </button>
        </div>
      </div>

      {/* Info Icon */}
      <div
        className="info-icon"
        onClick={() => setShowDisclaimer(!showDisclaimer)}
      >
        <MdInfo size={24} />
      </div>

      {/* Conditional Rendering of Disclaimer Inside Footer */}
      {showDisclaimer && (
        <section className="copyright-section" ref={disclaimerRef}>
          <div className="copyright-disclaimer">
            <button
              className="close-btn"
              onClick={() => setShowDisclaimer(false)}
            >
              <MdClose size={20} />
            </button>
            <p>
              Ask IndiaSpend is an AI-powered tool that derives information from
              IndiaSpend’s articles and interprets data based on our reporting.
              While we strive to provide accurate and contextual insights, some
              responses may not be current. For more information, please refer
              to our stories linked in the responses. For any concerns or
              clarifications, please reach out to us at{" "}
              <a href="mailto:respond@indiaspend.org">respond@indiaspend.org</a>
              .
            </p>
            <p>&copy; {new Date().getFullYear()} Indiaspend.com</p>
          </div>
        </section>
      )}
    </footer>
  );
};

export default Footer;
