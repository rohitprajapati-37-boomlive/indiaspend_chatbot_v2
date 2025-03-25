import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MdOutlineRefresh, MdAutoDelete } from "react-icons/md";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import logo from "../assets/ask_indiaspend.svg";
import Footer from "./Footer";
import "../styles/TrendingQuestions.css";
import placeholder from '../assets/placeholder.jpeg';
import {
  fetchIframes,
  getDomain,
  fetchMetaTitle,
  sortByPublishedTime,
  getMostRelevantIframeIndex,
  fetchMetaTitlesFromApi,
} from "../utils/utils";
import IframeComponent from "./IframeComponent";
const getRandomQuestions = (questionsArray, count) => {
  const randomQuestions = [];
  const questionsCopy = [...questionsArray];

  for (let i = 0; i < count; i++) {
    if (questionsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * questionsCopy.length);
    randomQuestions.push(questionsCopy.splice(randomIndex, 1)[0]);
  }

  return randomQuestions;
};

const cleanQuestion = (question) => {
  return question
    .replace(/^Article\s*\d*: \s*/, "")
    .replace(/^- /, "")
    .trim();
};

const getRandomIcon = (icons) => {
  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex];
};

const questionIcons = [];

function TrendingQuestions({
  question,
  isSubmit,
  setIsSubmit,
  setSubmitLoading,
  setQuestionString,
  isClearHistory,
  setIsClearHistory,
  isStartNewThread,
  setIsStartNewThread,
  questionsSet,
  setQuestionsSet,
  questions,
  setQuestions,
  setLoading,
  loading,
  setError,
  error,
  setIsEducationCheck,
  setIsGenderCheck,
  setIsEarthCheck
}) {
  // const [questions, setQuestions] = useState([]);
  // const [questionsSet, setQuestionsSet] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [sourceLoading, setSourceLoading] = useState(false);

  const [history, setHistory] = useState([]);
  // const [iframeInfo, setIframeInfo] = useState(null);
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const lastAnswerRef = useRef(null);
  const lastPRef = useRef(null);
  const sourcesRef = useRef(null); // Create a reference for the sources section
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [userScroll, setUserScroll] = useState(false);

  useEffect(() => {
    console.log("QUESTION", question);

    if (question.trim() !== "" && isSubmit) {
      handleQuestionClick(question);
      // ✅ Function Trigger
      setQuestionString("");
    }
  }, [question, isSubmit]); //

  const historySectionRef = useRef(null);

  useEffect(() => {
    const historySection = historySectionRef.current;

    const handleScroll = () => {
      if (historySection) {
        setUserScroll(historySection.scrollTop > 100);
        console.log("Scroll Top:", historySection.scrollTop); // This will display the scrollTop value
      }
    };

    // Add scroll event listener
    if (historySection) {
      historySection.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (historySection) {
        historySection.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isClearHistory) {
      handleClearHistory();
    }
  }, [isClearHistory]); //

  useEffect(() => {
    // Scroll to the last appended answer when history updates
    if (lastAnswerRef.current) {
      lastAnswerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [history]); // Trigger effect when `history` changes

  useEffect(() => {
    // Scroll to the sources section when sources are updated
    if (sources.length > 0 && sourcesRef.current) {
      sourcesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [sources]); // Trigger effect when `sources` changes

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://toolbox.boomlive.in/api_project/indiaspendtemp.php?pulljson=true",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        const cleanedQuestions = data.latest_json.questions.map(cleanQuestion);
        const nonEmptyQuestions = cleanedQuestions.filter((q) => q !== "");
        setQuestionsSet(nonEmptyQuestions);
        const randomQuestions = getRandomQuestions(nonEmptyQuestions, 4);
        setQuestions(randomQuestions);
      } catch (error) {
        setError("Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const storedHistory = localStorage.getItem("questionHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory)); // ✅ Convert string back to array
    }
  }, []);
  // Function to append UTM parameters to a URL
  // function addUtmToUrl(url) {
  //   const utmParams = "?utm_source=ask_indiaspend";

  //   try {
  //     let urlObj = new URL(url);
  //     urlObj.search += (urlObj.search ? "&" : "") + utmParams.substring(1);
  //     return urlObj.toString();
  //   } catch (error) {
  //     console.error("Invalid URL:", url);
  //     return url;
  //   }
  // }

  function addUtmToUrl(url) {
    try {
      let urlObj = new URL(url);

      // 🔹 Remove trailing `/` only if it's at the end of the pathname (not in query)
      urlObj.pathname = urlObj.pathname.replace(/\/$/, "");

      // 🔹 Use URLSearchParams to modify query parameters safely
      let params = new URLSearchParams(urlObj.search);
      params.set("utm_source", "ask_indiaspend"); // Overwrite if exists

      // 🔹 Set updated search params
      urlObj.search = params.toString();

      return urlObj.toString();
    } catch (error) {
      console.error("Invalid URL:", url);
      return url;
    }
  }
  const handleQuestionClick = async (question) => {
    setIsStartNewThread(false);
    setIsEducationCheck(false)
    setIsGenderCheck(false)
    setIsEarthCheck(false)
    setIsSubmit(false);
    setSelectedQuestion(question);
    setLoading(true);
    setSubmitLoading(true);
    setAnswer(""); // Clear previous answer
    setSources([]); // Clear previous sources
    setError(null);
    let fetchedAnswer = ""; // Initialize useRef for storing answer data
    let isFirstMessage = true; // Flag to check if it's the first message
    let fetchedSources = [];
    let iframeInfo = null;
    let articleInfo;
    const urlsToRemove = ["https://www.indiaspend.com/the-gender-skew/"];
    const utmParams = "?utm_source=ask_indiaspend";

    try {
      const eventSource = new EventSource(
        `https://i4g0k440wkc4o4skgocgwg88.vps.boomlive.in/stream_query?question=${encodeURIComponent(
          question
        )}&thread_id=default`
      );

      eventSource.onmessage = async (event) => {
        // Ignore unwanted initial messages
        if (
          isFirstMessage &&
          (event.data === "Yes" ||
            event.data === "No" ||
            event.data === "." ||
            event.data === "")
        ) {
          return;
        }

        isFirstMessage = false; // Mark first message as processed

        // Handle the `[end]` signal
        if (event.data === "[end]") {
          // console.log("End of stream received.");
          eventSource.close(); // Close the stream

          if (fetchedAnswer.includes("Sources:")) {
            // Find the index of "Sources:"
            const sourcesIndex = fetchedAnswer.indexOf("Sources:");

            // Trim the fetchedAnswer and save the sources part
            const sourcesData = fetchedAnswer
              .slice(sourcesIndex + "Sources:".length)
              .trim();
            // console.log("souresData", sourcesData);

            // Regular expression to find URLs (assuming sources are URLs)
            const urlRegex = /(https?:\/\/[^\s]+)/g;

            // Extract valid URLs using regex
            fetchedSources = sourcesData.match(urlRegex);
            // console.log("fetchedSources", fetchedSources);

            // Remove the sources part from fetchedAnswer
            fetchedAnswer = fetchedAnswer.slice(0, sourcesIndex).trim();
            // console.log(fetchedAnswer);
          }

          return;
        }

        try {
          const data = JSON.parse(event.data); // Parse JSON data if it's structured
          if (data.sources) {
            // console.log("Sources received:", data.sources);
            fetchedSources = data.sources;
            console.log(fetchedAnswer);
            // Modify "Read more" link in fetchedAnswer
            if (fetchedSources.length > 0) {
              setSourceLoading(true);
            }
            fetchedAnswer = fetchedAnswer.replace(
              /\[Read more\]\((https?:\/\/[^\s)]+)\)/g,
              (match, url) => `[Read more ➙](${addUtmToUrl(url)})`
            );

            console.log("modifiedAnswer", fetchedAnswer);
            const urlRegex = /(https?:\/\/[^\s)]+)/g;
            const extractedUrls = fetchedAnswer.match(urlRegex);
            console.log("extractedUrls", extractedUrls);
            // calling charts scraping function here

            const Iframes = await fetchIframes(extractedUrls);
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log(Iframes);
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            const iframeTitles = await fetchMetaTitlesFromApi(Iframes);
            console.log(
              "%%%%%%%%%%%%%%%%%%%%%%%%iframeTitles%%%%%%%%%%%%%%%%%%%%%%%%%"
            );
            console.log(iframeTitles);
            console.log(
              "%%%%%%%%%%%%%%%%%%%%%%%%%iframeTitles%%%%%%%%%%%%%%%%%%%%%%%%"
            );

            const bestIframeIndex = getMostRelevantIframeIndex(
              question,
              iframeTitles
            );

            if (Iframes.length > 0) {
              iframeInfo = {
                iframeLink: Iframes[bestIframeIndex],
                iframeSource: extractedUrls[0],
              };
            }
            // setIframeInfo(iframeInfo);
            if (extractedUrls) {
              urlsToRemove.push(...extractedUrls);
            }
            //
            console.log(urlsToRemove, "urlsToRemove", extractedUrls);

            console.log(fetchedSources);

            const updatedSources = fetchedSources.map((url) => {
              try {
                let urlObj = new URL(url);

                // 🔹 Remove trailing `/` only if it's at the end of the pathname
                urlObj.pathname = urlObj.pathname.replace(/\/$/, "");

                // 🔹 Use URLSearchParams to modify query parameters safely
                let params = new URLSearchParams(urlObj.search);
                params.set("utm_source", "ask_indiaspend"); // Overwrite if exists

                // 🔹 Set updated search params
                urlObj.search = params.toString();

                return urlObj.toString();
              } catch (error) {
                console.error("Invalid URL:", url);
                return url;
              }
            });

            console.log(updatedSources);

            // Apply filter
            fetchedSources = updatedSources.filter((url) => {
              const shouldRemove = urlsToRemove.includes(url);
              if (shouldRemove) {
                console.log("Removing:", url); // Debugging ke liye
              }
              return !shouldRemove;
            });
            const topFourSources = fetchedSources.slice(0, 4); // Get first 4 URLs
            articleInfo = await fetchMetadataFromApi(topFourSources);
            // console.log(articleInfo);
            setSources(data.sources); // Update sources state
            setSourceLoading(false);
          } else {
            let fetchedEventData = event.data.replace(/\\n/g, "  \n"); // Removes literal '\n'

            fetchedAnswer += fetchedEventData; // Append chunk to the answer
          }
        } catch (err) {
          // Count the number of newlines and log it

          let fetchedEventData = event.data.replace(/\\n/g, "  \n"); // Removes literal '\n'
          fetchedAnswer += fetchedEventData; // Assume plain text if parsing fails
        }

        setAnswer(fetchedAnswer); // Update the answer state

        const updatedHistory = [
          {
            question,
            answer: fetchedAnswer,
            sources: articleInfo,
            timestamp: new Date().toISOString(),
            iframeInfo: iframeInfo,
          },
          ...history,
        ];
        setHistory(updatedHistory);

        localStorage.setItem("questionHistory", JSON.stringify(updatedHistory));
        setLoading(false);
        setSubmitLoading(false);
      };

      eventSource.onerror = () => {
        setError("Error streaming the answer");
        eventSource.close();
      };

      eventSource.onclose = () => {
        const updatedHistory = [
          {
            question,
            answer: fetchedAnswer,
            sources: [], // No sources available in this case
            timestamp: new Date().toISOString(),
          },
          ...history,
        ];
        setHistory(updatedHistory);

        localStorage.setItem("questionHistory", JSON.stringify(updatedHistory));
        setLoading(false);
        setSourceLoading(false);
      };
    } catch (error) {
      setError("Failed to stream the answer");
      setLoading(false);
    }
  };

  const fetchMetadataFromApi = async (urls) => {
    try {
      // Convert the URLs array into a JSON string
      const urlParam = JSON.stringify(urls);

      // Make the API call
      const response = await fetch(
        `https://toolbox.boomlive.in/api_project/mediator_vue.php?get_metadata_from_arr=${encodeURIComponent(
          urlParam
        )}`
      );

      if (response.ok) {
        // Parse and return the JSON response
        return await response.json();
      } else {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching metadata from API:", error);
      throw error; // Re-throw the error for the calling code to handle
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    const fetchNewQuestions = async () => {
      try {
        const randomQuestions = getRandomQuestions(questionsSet, 4);
        setQuestions(randomQuestions);
      } catch (error) {
        setError("Error fetching questions");
      } finally {
        setLoading(false);
      }
    };
    fetchNewQuestions();
  };

  const validateImageUrls = (data) => {
    return data.map((item) => {
      const isValidImageUrl = (url) => {
        if (!url) return false;
        // Exclude the specific URL by marking it as invalid
        if (url === "https://www.indiaspend.com/images/logo.png") return false;
        
        // Regex to check for valid image extensions
        const imageExtensions = /\.(jpeg|jpg|gif|png|webp|svg)$/i;
        return imageExtensions.test(url);
      };
  
      return {
        ...item,
        preview_image_url: isValidImageUrl(item.preview_image_url)
          ? item.preview_image_url
          : null, // or "" if you prefer an empty string
      };
    });
  };
  

  

  const formatMarkdownToJSX = (markdownText) => {
    // Replace single line breaks with two spaces (soft break) to trigger new lines
    let formattedText = markdownText.replace(/\n/g, "  \n");

    // Ensure multiple newlines between paragraphs are maintained for hard breaks
    formattedText = formattedText.replace(/\n\s*\n/g, "\n\n");

    // Optionally, handle other markdown edge cases like lists or headings
    // You can add further processing here for other markdown elements if needed

    return formattedText;
  };

  // Render sources section with metadata
  const renderSources = (itemSources) => {
    if (!itemSources?.final_response?.length) {
      return null; // If there are no sources, return null
    }

    console.log("Item sources:", itemSources); // Debugging

    // Remove duplicates based on post_url
    const uniqueSources = itemSources.final_response.filter(
      (source, index, self) =>
        index === self.findIndex((s) => s.post_url === source.post_url)
    );

    const abcd = validateImageUrls(uniqueSources);

    const sortedSources = sortByPublishedTime(abcd);
    console.log("sortedSources",sortedSources);

    // // Show shimmer effect if loading
    // if (1==1) {
    //   return (
    //     <div className="loading-sour">
    //       <div className="skeleton-card">
    //         <div className="skeleton-loader"></div>
    //         <div className="skeleton-item"></div>
    //         <div className="skeleton-item"></div>
    //         <div className="skeleton-item"></div>
    //       </div>
    //     </div>
    //   );
    // }
    const maxCards = 4;

    return (
      <div>
        <div className="txt-source-url">
          <span className="rlte-tite">Related articles</span>
        </div>
        <ul ref={sourcesRef}>
          {sortedSources.slice(0, maxCards).map((source, index) => (
            <li key={index} className="sources-tle-url">
              <div className="txt-source-url">
                <a href={source.post_url} target="_blank" rel="noopener ">
                  <img
                    src={source.preview_image_url || placeholder}
                    alt={source.title}
                    className="source-image"
                  />
                  <h5>{source.title || source.post_url}</h5>
                </a>
              </div>
            </li>
          ))}

        </ul>
      </div>
    );
  };

  const CustomLink = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );

  const answerRefs = useRef({});

  useEffect(() => {
    // Scroll to the expanded answer when it changes
    if (expandedAnswer && answerRefs.current[expandedAnswer]) {
      answerRefs.current[expandedAnswer].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [expandedAnswer]);

  //

  const handleClearHistory = () => {
    setIsClearHistory(false);
    const storedHistory =
      JSON.parse(localStorage.getItem("questionHistory")) || [];
    localStorage.removeItem("questionHistory"); // Chat history delete karega
    // setPreviousQuestions(storedHistory.slice(0, 5)); // Last 5 questions store karega
    // window.location.reload(); // Page refresh karega taki naye chat shuru ho
    setHistory([]);
  };

  //

  return (
    <>
      <main className="trending-questions">
        {history.length > 0 && !isStartNewThread && (
          <div className="history-section" ref={historySectionRef}>
            <div className="history-list">
              <ul className="history-items">
                {[...history].reverse().map((item, index, array) => (
                  <li
                    key={index}
                    className={`history-card ${expandedAnswer === item.answer ||
                        index === array.length - 1
                        ? "expanded"
                        : ""
                      }`}
                    ref={index === array.length - 1 ? lastAnswerRef : null}
                  >
                    <div className="question-content">
                      <div className="question-icon">
                        {/* <FaUserCircle /> */}
                      </div>
                      <h4 className="question-text text-2xl font-semibold">
                        {item.question}
                      </h4>
                    </div>
                    <div className="answer-content">
                      {/* <div className="answer-icon">
                        <img
                          src={logo}
                          alt="Ask IndiaSpend"
                          className="custom-icon"
                        />
                      </div> */}
                      <p
                        className="answer-preview"
                        ref={index === 0 ? lastPRef : null}
                      >
                        <ReactMarkdown components={{ a: CustomLink }}>
                          {expandedAnswer === item.answer ||
                            index === array.length - 1
                            ? formatMarkdownToJSX(item.answer)
                            : `${item.answer.substring(0, 250)}...`}
                        </ReactMarkdown>

                        {/* {(expandedAnswer === item.answer ||
                          index === array.length - 1) && (
                          <div className="sources-section text-lg">
                            {item.iframeInfo && (
                              <div>
                                <IframeComponent
                                  key={index}
                                  iframeInfo={item.iframeInfo}
                                />
                              </div>
                            )}
                            {item.sources?.length > 0 && (
                              <div className="txt-source-url">
                                <span className="rlte-tite">
                                  Related Articles Source
                                </span>
                              </div>
                            )}
                            {
                              item.sources && renderSources(item.sources)
                              // : (
                              //   <div className="txt-source-url">
                              //     <span className="loading-text">Loading...</span>
                              //   </div>
                              // )
                            }

                            {sourceLoading && index == array.length - 1 && (
                              <div className="loading-sour">
                                <div className="skeleton-card">
                                  <div className="skeleton-loader"></div>
                                  <div className="skeleton-item"></div>
                                  <div className="skeleton-item"></div>
                                  <div className="skeleton-item"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )} */}
                        {(expandedAnswer === item.answer ||
                          index === array.length - 1) && (
                            <div className="sources-section text-lg">
                              {/* Show loading until all three are loaded */}
                              {sourceLoading && index === array.length - 1 ? (
                                <div className="loading-sour">
                                  <div className="skeleton-card-sour">
                                    <div className="skeleton-image-sour"></div>
                                    <div className="skeleton-text-container">
                                      <div className="skeleton-text-sour"></div>
                                      <div className="skeleton-text-sour"></div>
                                    </div>
                                  </div>

                                  <div className="skeleton-card-sour">
                                    <div className="skeleton-image-sour"></div>
                                    <div className="skeleton-text-container">
                                      <div className="skeleton-text-sour"></div>
                                      <div className="skeleton-text-sour"></div>
                                    </div>
                                  </div>

                                  <div className="skeleton-card-sour">
                                    <div className="skeleton-image-sour"></div>
                                    <div className="skeleton-text-container">
                                      <div className="skeleton-text-sour"></div>
                                      <div className="skeleton-text-sour"></div>
                                    </div>
                                  </div>

                                  <div className="skeleton-card-sour">
                                    <div className="skeleton-image-sour"></div>
                                    <div className="skeleton-text-container">
                                      <div className="skeleton-text-sour"></div>
                                      <div className="skeleton-text-sour"></div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {item.iframeInfo && (
                                    <div className="dataviz-section">
                                      {item.iframeInfo && (
                                        <div>
                                          <span className="rlte-tite">
                                            <strong> Dataviz References</strong>
                                          </span>
                                          <IframeComponent
                                            key={index}
                                            iframeInfo={item.iframeInfo}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {item.sources && renderSources(item.sources)}
                                </>
                              )}
                            </div>
                          )}
                      </p>

                      {index !== array.length - 1 && (
                        <button className="expand-container">
                          <div
                            className="text-expand-rk"
                            onClick={() =>
                              setExpandedAnswer(
                                expandedAnswer === item.answer
                                  ? null
                                  : item.answer
                              )
                            }
                          >
                            <div className="expand-answer-icon">
                              {expandedAnswer === item.answer ? (
                                <FaLongArrowAltUp />
                              ) : (
                                <FaLongArrowAltDown />
                              )}
                            </div>
                            <div className="expand-text-rk">
                              <div className="expand-toggle">
                                {expandedAnswer === item.answer
                                  ? "Collapse"
                                  : "Expand"}
                              </div>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="clear-hst-ic-txt">
              <button
                onClick={handleClearHistory}
                className="clear-history-btn"
              >
                <div className="cler-hst-ic">
                  <MdAutoDelete />
                </div>
                <div className="cler-hst-txt">Clear History</div>
              </button>
            </div> */}
          </div>
        )}
        {isStartNewThread && (
          <div className="questions-grid">
            <div className="tren-q-tit ">
              <h1 className="text-2xl font-bold">Trending Questions</h1>
            </div>
            <div className="refresh-section-container">
              <div className="refresh-section" onClick={handleRefresh}>
                <div className="refreshingrk">
                  <MdOutlineRefresh />
                </div>
                <div className="ref-txt-rk">
                  <h4>Refresh</h4>
                </div>
              </div>
            </div>
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q, index) => (
                <div
                  key={index}
                  className="question-card"
                  onClick={() => handleQuestionClick(q)}
                >
                  <div className="question-icon">
                    {getRandomIcon(questionIcons)}
                  </div>
                  <h4 className="question-text text-lg font-semibold">{q}</h4>
                </div>
              ))
            ) : (
              <p>No questions found.</p>
            )}
          </div>
        )}

        {/* {history.length === 0 && (
          <div className="questions-grid">
            <div className="tren-q-tit ">
              <h2 className="text-2xl font-bold">Trending Questions</h2>
            </div>
            <div className="refresh-section-container">
              <div className="refresh-section" onClick={handleRefresh}>
                <div className="refreshingrk">
                  <MdOutlineRefresh />
                </div>
                <div className="ref-txt-rk">
                  <h4>Refresh</h4>
                </div>
              </div>
            </div>
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q, index) => (
                <div
                  key={index}
                  className="question-card"
                  onClick={() => handleQuestionClick(q)}
                >
                  <div className="question-icon">
                    {getRandomIcon(questionIcons)}
                  </div>
                  <h4 className="question-text text-lg font-semibold">{q}</h4>
                </div>
              ))
            ) : (
              <p>No questions found.</p>
            )}
          </div>
        )} */}
        {error && <p className="error">{error}</p>}

        {loading ? (
          <div className="loading">
            <div className="skeleton-card">
              <div className="skeleton-loader"></div>
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
            </div>
          </div>
        ) : history.length === 0 && !isStartNewThread ? (
          <div className="questions-grid">
            <div className="tren-q-tit ">
              <h1 className="text-2xl font-bold">Trending Questions</h1>
            </div>
            <div className="refresh-section-container">
              <div className="refresh-section" onClick={handleRefresh}>
                <div className="refreshingrk">
                  <MdOutlineRefresh />
                </div>
                <div className="ref-txt-rk">
                  <h4>Refresh</h4>
                </div>
              </div>
            </div>
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q, index) => (
                <div
                  key={index}
                  className="question-card"
                  onClick={() => handleQuestionClick(q)}
                >
                  <div className="question-icon">
                    {getRandomIcon(questionIcons)}
                  </div>
                  <h4 className="question-text text-lg font-semibold">{q}</h4>
                </div>
              ))
            ) : (
              <p>No questions found.</p>
            )}
          </div>
        ) : null}
        {/* <div className="footer-sectionrk"> */}
        {/* <Footer onSubmitQuestion={handleQuestionClick} onLoading={loading} /> */}
        {/* </div> */}
      </main>
    </>
  );
}

export default TrendingQuestions;
