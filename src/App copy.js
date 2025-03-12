import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import axios
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TrendingQuestions from "./components/TrendingQuestions";
import FAQ from "./components/FAQ";
import FeedbackForm from "./components/FeedbackForm";
import { MdClose } from "react-icons/md";
import "./App.css";

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // ✅ 24 hours in milliseconds
let tabdata = {}; // ✅ Ensure tabdata is defined

// ✅ Function to generate a random string
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// ✅ Function to generate new Thread ID and store it in backend
const generateNewThreadID = () => {
  const newThreadID = generateRandomString(12);
  tabdata.threadID = newThreadID;

  const dataToStore = {
    id: newThreadID,
    timestamp: Date.now(),
  };

  localStorage.setItem("threadIDData", JSON.stringify(dataToStore));

  // ✅ API Call to GoDaddy MySQL Backend
  axios
    .post("http://your-server-ip:5000/save-thread", { threadID: newThreadID })
    .then((response) => {
      console.log("✅ Thread ID stored:", response.data);
    })
    .catch((error) => {
      console.error("❌ Error storing Thread ID:", error);
    });

  // ✅ Existing API call
  axios
    .get(
      "https://ask.indiaspend.com/api_server/chatbot_generateQuestions.php",
      {
        params: {
          checkThread_indiaspend: true,
          thread_id: newThreadID,
        },
      }
    )
    .then((response) => {
      console.log("✅ chatbotThreadsRK:", response.data);
    })
    .catch((error) => {
      console.error("❌ Error fetching data:", error);
    });
};

function App() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleShowFAQ = () => {
    setShowFAQ(true);
    setShowFeedback(false);
  };

  const handleShowFeedback = () => {
    setShowFAQ(false);
    setShowFeedback(true);
  };

  const closeModals = () => {
    setShowFAQ(false);
    setShowFeedback(false);
  };

  // ✅ useEffect to check thread ID on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("threadIDData"));

    if (storedData && Date.now() - storedData.timestamp < EXPIRATION_TIME) {
      tabdata.threadID = storedData.id; // ✅ Use stored ID if valid
    } else {
      generateNewThreadID(); // ✅ Generate new ID if expired or missing
    }
  }, []); // ✅ Run only once when component mounts

  return (
    <div className="app">
      <div className="main-content">
        <Header
          setShowFAQ={setShowFAQ}
          setShowFeedback={setShowFeedback}
          showFAQ={showFAQ}
          showFeedback={showFeedback}
        />

        <div className="content-container">
          {/* ✅ Sidebar */}
          <Sidebar setShowFAQ={setShowFAQ} setShowFeedback={setShowFeedback} />

          {/* ✅ TrendingQuestions sirf tab dikhe jab FAQ or Feedback band ho */}
          {!showFAQ && !showFeedback && <TrendingQuestions />}

          {/* FAQ Modal */}
          {showFAQ && (
            <div className="faq-content modal">
              <button className="close-btn" onClick={closeModals}>
                <MdClose size={24} />
              </button>
              <FAQ />
            </div>
          )}

          {/* Feedback Modal */}
          {showFeedback && (
            <div className="faq-content modal">
              <button className="close-btn" onClick={closeModals}>
                <MdClose size={24} />
              </button>
              <FeedbackForm />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <section className="copyright-section">
        <div className="copyright-disclaimer">
          <p>
            Ask IndiaSpend is an AI-powered tool that derives information from
            IndiaSpend’s articles and interprets data based on our reporting.
            While we strive to provide accurate and contextual insights, some
            responses may not be current. For more information, please refer to
            our stories linked in the responses. For any concerns or
            clarifications, please reach out to us at{" "}
            <a href="mailto:respond@indiaspend.org">respond@indiaspend.org.</a>
          </p>
          <p>&copy; {new Date().getFullYear()} Indiaspend.com</p>
        </div>
      </section>
    </div>
  );
}

export default App;
