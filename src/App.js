import React, { useEffect, useState, useRef } from "react";
import axios from "axios"; // ✅ Import axios
import logo from "../src/assets/ask_indiaspend.svg";
import { GoSidebarExpand, GoSun, GoMoon, GoTrash } from "react-icons/go";
import { Tooltip as ReactTooltip } from "react-tooltip";
// import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";
import { MdSend } from "react-icons/md";
// import { MdAutoDelete } from "react-icons/md";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TrendingQuestions from "./components/TrendingQuestions";
import FAQ from "./components/FAQ";
import FeedbackForm from "./components/FeedbackForm";
import { MdClose } from "react-icons/md";
// import "./App.css";
// import "./abhApp.css";
import "./abhApp.scss";
import { Colors } from "chart.js";
import {
  fetchIframes,
  getDomain,
  fetchMetaTitle,
  addUtmToUrl,
  fetchMetadataFromApi,
} from "../src/utils/utils";

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

// ✅ Move `DarkModeToggle` outside `App`
const DarkModeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <GoSun /> : <GoMoon />}
    </button>
  );
};

function App() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [questions, setQuestions] = useState("");
  const [question, setQuestion] = useState("");

  const [questionString, setQuestionString] = useState("");

  const [isClearHistory, setIsClearHistory] = useState(false);

  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [error, setError] = useState(null);
  const [previousQuestions, setPreviousQuestions] = useState([]);

  const [isStartNewThread, setIsStartNewThread] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //   const [ userScroll, setUserScroll] = useState(false);

  const [isEarthCheck, setIsEarthCheck] = useState(false);
  const [isEducationCheck, setIsEducationCheck] = useState(false);
  const [isGenderCheck, setIsGenderCheck] = useState(false);
  const [questionsSet, setQuestionsSet] = useState([]);
  const [loading, setLoading] = useState(true);

  const footerRef = useRef(null);





  const handleShowFAQ = () => {
    setShowFAQ(true);
    setShowFeedback(false);
  };

  const handleShowFeedback = () => {
    setShowFAQ(false);
    setShowFeedback(true);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeModals = () => {
    setShowFAQ(false);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    setIsSubmit(true);
    setQuestion(questionString);
  };

  const handleClearHistory = () => {

    setIsClearHistory(true);
  };

  const startNewThread = () => {
    setIsStartNewThread(true);
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
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsSubmit(true);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the prompt from showing
      event.preventDefault();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <>
      <div class="app">
        <div class="mainContainer">
          <Sidebar
            setShowFAQ={setShowFAQ}
            setShowFeedback={setShowFeedback}
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            startNewThread={startNewThread}
            setIsCollapsed={setIsCollapsed}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsEarthCheck={setIsEarthCheck}
            setIsEducationCheck={setIsEducationCheck}
            setIsGenderCheck={setIsGenderCheck}
            setQuestions={setQuestions}
            setQuestionsSet={setQuestionsSet}
            setLoading={setLoading}
            loading={loading}
            setError={setError}
            error={error}
            setIsStartNewThread={setIsStartNewThread}
          />
          {/* </div> */}
          {/* </div> */}

          <div class="bodyContainer">
            <div class="workingContainer">
              <div class="head_c wc_item">
                <div className="leftside">
                  {/* sidebar expand */}

                  <div>
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="mobile-menu-toggle"
                    >
                      <GoSidebarExpand />
                    </button>
                  </div>
                </div>

                <div className="middle">
                  {/* logo  */}
                  <div class="logoDiv">
                    <div
                      className="logo-container"
                      onClick={() => window.location.reload()}
                    >
                      <img src={logo} alt="IndiaSpend Logo" className="logo" />
                      {isCollapsed && <h4>Ask IndiaSpend</h4>}
                    </div>
                  </div>
                </div>

                <div className="rightside">
                  <div className="clear-hst-ic-txt">
                    <button
                      onClick={handleClearHistory}
                      className="clear-history-btn"
                    >
                      <div
                        data-tooltip-id="Clear_History"
                        className="cler-hst-ic"
                      >
                        <GoTrash />
                        {/* <span className="tooltip_text">Clear History</span> */}
                      </div>
                      {/* <div className="cler-hst-txt">Clear History</div> */}
                    </button>
                  </div>

                  <div data-tooltip-id="theme" className="dark-mode-container">
                    <DarkModeToggle />
                    {/* <span className="tooltip_text">Theme</span> */}
                  </div>
                </div>
              </div>

              <div class="thin_width">
                <div className="conents_c wc_item">
                  {!showFAQ && !showFeedback && (
                    <TrendingQuestions
                      question={questionString}
                      isSubmit={isSubmit}
                      setIsSubmit={setIsSubmit}
                      setSubmitLoading={setSubmitLoading}
                      setQuestionString={setQuestionString}
                      isClearHistory={isClearHistory}
                      setIsClearHistory={setIsClearHistory}
                      isStartNewThread={isStartNewThread}
                      setIsStartNewThread={setIsStartNewThread}
                      questionsSet={questionsSet}
                      setQuestionsSet={setQuestionsSet}
                      questions={questions}
                      setQuestions={setQuestions}
                      setLoading={setLoading}
                      loading={loading}
                      setError={setError}
                      error={error}
                      setIsEducationCheck={setIsEducationCheck}
                      setIsGenderCheck={setIsGenderCheck}
                      setIsEarthCheck={setIsEarthCheck}
                    />
                  )}

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

                {!showFAQ && !showFeedback && (
                  <div ref={footerRef} className="foot_c wc_item">
                    <div className="footer-content">
                      <div>
                        <h2>Got a Question? Get Expert Answers!</h2>
                        <p>
                          Ask a data-driven question, and our experts will get
                          back to you.
                        </p>
                      </div>

                      <div className="input-container">
                        <input
                          type="text"
                          placeholder="Ask something here..."
                          value={questionString}
                          onChange={(e) => setQuestionString(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={submitLoading}
                        />{" "}
                        <button
                          type="submit"
                          className="send-btn"
                          onClick={handleSubmit}
                          disabled={submitLoading || questionString === ""}
                        >
                          <MdSend />
                        </button>
                      </div>
                    </div>

                    <div className="disclaimer_div">
                      <span>
                        <strong>Disclaimer: </strong>
                        <span>
                          Ask IndiaSpend is an AI-powered tool that derives
                          information from IndiaSpend’s articles and interprets
                          data based on our reporting. While we strive to
                          provide accurate and contextual insights, some
                          responses may not be current. For more information,
                          please refer to our stories linked in the responses.
                          For any concerns or clarifications, please reach out
                          to us at{" "}
                          <a href="mailto:respond@indiaspend.org">
                            respond@indiaspend.org
                          </a>
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="footerContainer wc_item">Disclaimer</div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="tooltip-wrapper">
        <ReactTooltip id="theme" place="bottom" content="Theme" />
        <ReactTooltip
          id="Clear_History"
          place="bottom"
          content="Clear History"
        />
      </div>
    </>
  );
}

export default App;
