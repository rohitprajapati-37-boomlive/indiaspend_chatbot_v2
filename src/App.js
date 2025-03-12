import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import axios

import logo from "../src/assets/ask_indiaspend.svg";
import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";
import { MdSend } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TrendingQuestions from "./components/TrendingQuestions";
import FAQ from "./components/FAQ";
import FeedbackForm from "./components/FeedbackForm";
import { MdClose } from "react-icons/md";
// import "./App.css";
import "./abhApp.css";
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
      {theme === "light" ? (
        <MdOutlineDarkMode size={25} />
      ) : (
        <MdLightMode size={25} />
      )}
    </button>
  );
};

function App() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    // const storedHistory =
    //   JSON.parse(localStorage.getItem("questionHistory")) || [];
    // localStorage.removeItem("questionHistory"); // Chat history delete karega
    // setPreviousQuestions(storedHistory.slice(0, 5)); // Last 5 questions store karega
    // // window.location.reload(); // Page refresh karega taki naye chat shuru ho
    // // setAnswer(""); // Clear previous answer
    // // setSources([]); // Clear previous sources
    // // setError(null);
    // setHistory([]);
    setIsClearHistory(true);
  };

  // const handleQuestionClick = async (question) => {
  //   // console.log(question);
  //   setSelectedQuestion(question);
  //   setLoading(true);
  //   setAnswer(""); // Clear previous answer
  //   setSources([]); // Clear previous sources
  //   setError(null);
  //   let fetchedAnswer = ""; // Initialize useRef for storing answer data
  //   let isFirstMessage = true; // Flag to check if it's the first message
  //   let fetchedSources = [];
  //   let iframeInfo = null;
  //   let articleInfo;
  //   const urlsToRemove = ["https://www.indiaspend.com/the-gender-skew/"];
  //   const utmParams = "?utm_source=ask_indiaspend";

  //   try {
  //     const eventSource = new EventSource(
  //       `https://i4g0k440wkc4o4skgocgwg88.vps.boomlive.in/stream_query?question=${encodeURIComponent(
  //         question
  //       )}&thread_id=default`
  //     );

  //     eventSource.onmessage = async (event) => {
  //       // Ignore unwanted initial messages
  //       if (
  //         isFirstMessage &&
  //         (event.data === "Yes" ||
  //           event.data === "No" ||
  //           event.data === "." ||
  //           event.data === "")
  //       ) {
  //         return;
  //       }

  //       isFirstMessage = false; // Mark first message as processed

  //       // Handle the `[end]` signal
  //       if (event.data === "[end]") {
  //         // console.log("End of stream received.");
  //         eventSource.close(); // Close the stream

  //         if (fetchedAnswer.includes("Sources:")) {
  //           // Find the index of "Sources:"
  //           const sourcesIndex = fetchedAnswer.indexOf("Sources:");

  //           // Trim the fetchedAnswer and save the sources part
  //           const sourcesData = fetchedAnswer
  //             .slice(sourcesIndex + "Sources:".length)
  //             .trim();
  //           // console.log("souresData", sourcesData);

  //           // Regular expression to find URLs (assuming sources are URLs)
  //           const urlRegex = /(https?:\/\/[^\s]+)/g;

  //           // Extract valid URLs using regex
  //           fetchedSources = sourcesData.match(urlRegex);
  //           // console.log("fetchedSources", fetchedSources);

  //           // Remove the sources part from fetchedAnswer
  //           fetchedAnswer = fetchedAnswer.slice(0, sourcesIndex).trim();
  //           // console.log(fetchedAnswer);
  //         }
  //         return;
  //       }

  //       try {
  //         const data = JSON.parse(event.data); // Parse JSON data if it's structured
  //         if (data.sources) {
  //           // console.log("Sources received:", data.sources);
  //           fetchedSources = data.sources;
  //           console.log(fetchedAnswer);
  //           // Modify "Read more" link in fetchedAnswer
  //           fetchedAnswer = fetchedAnswer.replace(
  //             /\[Read more\]\((https?:\/\/[^\s)]+)\)/g,
  //             (match, url) => `[Read more](${addUtmToUrl(url)})`
  //           );

  //           console.log("modifiedAnswer", fetchedAnswer);
  //           const urlRegex = /(https?:\/\/[^\s)]+)/g;
  //           const extractedUrls = fetchedAnswer.match(urlRegex);
  //           console.log("extractedUrls", extractedUrls);
  //           // calling charts scraping function here

  //           const Iframes = await fetchIframes(extractedUrls);
  //           console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  //           console.log(Iframes);
  //           console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  //           if (Iframes.length > 0) {
  //             iframeInfo = {
  //               iframeLink: Iframes[0],
  //               iframeSource: extractedUrls[0],
  //             };
  //           }
  //           // setIframeInfo(iframeInfo);
  //           if (extractedUrls) {
  //             urlsToRemove.push(...extractedUrls);
  //           }
  //           //
  //           console.log(urlsToRemove, "urlsToRemove", extractedUrls);

  //           console.log(fetchedSources);

  //           const updatedSources = fetchedSources.map((url) => {
  //             try {
  //               let urlObj = new URL(url);

  //               // 🔹 Remove trailing `/` only if it's at the end of the pathname
  //               urlObj.pathname = urlObj.pathname.replace(/\/$/, "");

  //               // 🔹 Use URLSearchParams to modify query parameters safely
  //               let params = new URLSearchParams(urlObj.search);
  //               params.set("utm_source", "ask_indiaspend"); // Overwrite if exists

  //               // 🔹 Set updated search params
  //               urlObj.search = params.toString();

  //               return urlObj.toString();
  //             } catch (error) {
  //               console.error("Invalid URL:", url);
  //               return url;
  //             }
  //           });

  //           console.log(updatedSources);

  //           // Apply filter
  //           fetchedSources = updatedSources.filter((url) => {
  //             const shouldRemove = urlsToRemove.includes(url);
  //             if (shouldRemove) {
  //               console.log("Removing:", url); // Debugging ke liye
  //             }
  //             return !shouldRemove;
  //           });
  //           articleInfo = await fetchMetadataFromApi(fetchedSources);
  //           // console.log(articleInfo);
  //           setSources(data.sources); // Update sources state
  //         } else {
  //           let fetchedEventData = event.data.replace(/\\n/g, "  \n"); // Removes literal '\n'

  //           fetchedAnswer += fetchedEventData; // Append chunk to the answer
  //         }
  //       } catch (err) {
  //         // Count the number of newlines and log it

  //         let fetchedEventData = event.data.replace(/\\n/g, "  \n"); // Removes literal '\n'
  //         fetchedAnswer += fetchedEventData; // Assume plain text if parsing fails
  //       }

  //       setAnswer(fetchedAnswer); // Update the answer state

  //       const updatedHistory = [
  //         {
  //           question,
  //           answer: fetchedAnswer,
  //           sources: articleInfo,
  //           timestamp: new Date().toISOString(),
  //           iframeInfo: iframeInfo,
  //         },
  //         ...history,
  //       ];
  //       setHistory(updatedHistory);

  //       localStorage.setItem("questionHistory", JSON.stringify(updatedHistory));
  //       setLoading(false);
  //     };

  //     eventSource.onerror = () => {
  //       setError("Error streaming the answer");
  //       eventSource.close();
  //     };

  //     eventSource.onclose = () => {
  //       const updatedHistory = [
  //         {
  //           question,
  //           answer: fetchedAnswer,
  //           sources: [], // No sources available in this case
  //           timestamp: new Date().toISOString(),
  //         },
  //         ...history,
  //       ];
  //       setHistory(updatedHistory);

  //       localStorage.setItem("questionHistory", JSON.stringify(updatedHistory));
  //       setLoading(false);
  //     };
  //   } catch (error) {
  //     setError("Failed to stream the answer");
  //     setLoading(false);
  //   }
  // };
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
  return (
    <div class="app">
      <div class="mainContainer">
        <Sidebar
          setShowFAQ={setShowFAQ}
          setShowFeedback={setShowFeedback}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
        {/* </div> */}
        {/* </div> */}

        <div class="bodyContainer">
          <div class="workingContainer">
            <div class="head_c wc_item">
              <div className="clear-hst-ic-txt">
                <button
                  onClick={handleClearHistory}
                  className="clear-history-btn"
                >
                  <div className="cler-hst-ic">{/* <MdAutoDelete /> */}</div>
                  <div className="cler-hst-txt">Clear History</div>
                </button>
              </div>
              <DarkModeToggle />
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
                  />
                )}
              </div>

              <div className="foot_c wc_item">
                <div className="footer-content">
                  <div>
                    <h2>Got a Question? Get Expert Answers!</h2>
                    <p>
                      Ask a data-driven question, and our experts will get back
                      to you.
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

                <div class="disclaimer_div">
                  <span>
                    <strong>Disclaimer: </strong>
                    <span>
                      Ask IndiaSpend is an AI-powered tool that derives
                      information from IndiaSpend’s articles and interprets data
                      based on our reporting. While we strive to provide
                      accurate and contextual insights, some responses may not
                      be current. For more information, please refer to our
                      stories linked in the responses. For any concerns or
                      clarifications, please reach out to us at{" "}
                      <a href="mailto:respond@indiaspend.org">
                        respond@indiaspend.org
                      </a>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="footerContainer wc_item">Disclaimer</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
