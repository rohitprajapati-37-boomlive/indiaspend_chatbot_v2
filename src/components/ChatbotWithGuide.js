import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";
import "../styles/ChatbotWithGuide.css";

const ChatbotWithGuide = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    setSteps([
      {
        target: ".sidebar-content",
        content:
          "This is the sidebar where you can find useful links and options.",
        disableBeacon: true,
      },
      {
        target: ".ttlquicklink",
        content: "This is the quick links and options.",
        disableBeacon: true,
      },
      {
        target: ".faq-text",
        content: "This is the Faqs.",
        disableBeacon: true,
      },
      {
        target: ".Feedback-ur-text",
        content: "This is the Feedback.",
        disableBeacon: true,
      },
      {
        target: ".input-container input",
        content: "Type your question here and press enter to submit.",
        disableBeacon: true,
      },
      {
        target: ".send-btn",
        content: "Click here to send your question.",
        disableBeacon: true,
      },
    ]);

    setRun(true);
  }, []);

  return (
    <div className="chatbot-container">
      {/* ✅ Remove Welcome Heading Completely */}

      {/* Joyride Tour Guide */}
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showSkipButton={true}
        disableScrolling={false}
      />
    </div>
  );
};

export default ChatbotWithGuide;
