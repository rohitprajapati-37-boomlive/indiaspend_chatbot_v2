import React, { useEffect, useState } from "react";
import { AiFillAccountBook } from "react-icons/ai"; // Import specific React Icons
import {
  FaInfoCircle,
  FaLightbulb,
  FaSearch,
  FaComments,
  FaCheck,
  FaReply,
  FaThumbsUp,
  FaBullseye,
  FaExclamationCircle,
} from "react-icons/fa"; // Import FontAwesome icons
import Footer from "./Footer"; // Import the Footer component
import "../styles/TrendingQuestions.css";

// Function to get random questions
const getRandomQuestions = (questionsArray, count) => {
  const randomQuestions = [];
  const questionsCopy = [...questionsArray]; // Create a copy to avoid mutating the original array

  for (let i = 0; i < count; i++) {
    if (questionsCopy.length === 0) break; // Avoid errors if fewer than 'count' questions exist
    const randomIndex = Math.floor(Math.random() * questionsCopy.length);
    randomQuestions.push(questionsCopy.splice(randomIndex, 1)[0]);
  }

  return randomQuestions;
};

function TrendingQuestions() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState(""); // Store the answer
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]); // Store the history of questions and answers
  const [expandedAnswer, setExpandedAnswer] = useState(null); // Track expanded answer

  useEffect(() => {
    const response = {
      questions: [
        "What challenges do Jharkhand's tribals face in healthcare?",
        "How much do TB patients' families spend despite free care?",
        "What are the working conditions like in Surat's textile hub?",
        "How do stray dogs threaten Ladakh's snow leopards?",
        "Why are elephant conflicts increasing in Jharkhand?",
        "What is India's plan to eliminate lymphatic filariasis?",
        "How do women in UP confront lymphatic filariasis?",
        "Why keep Covid-era oxygen plants operational in India?",
        "What are the dangers of microplastics to humans?",
        "Why did Jay Bhattacharya oppose Covid lockdowns?",
      ],
    };

    const randomQuestions = getRandomQuestions(response.questions, 4);
    setQuestions(randomQuestions);
    setLoading(false);
  }, []);

  const handleQuestionClick = async (question) => {
    setSelectedQuestion(question);
    setLoading(true); // Set loading to true when fetching the answer

    try {
      const response = await fetch(
        `https://toolbox.boomlive.in/chatbot-py/query?question=${question}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get answer");
      }
      const data = await response.json();
      const fetchedAnswer = data.answer || "No answer found.";

      setAnswer(fetchedAnswer);

      // Add the question-answer pair to history after the answer is fetched
      setHistory((prevHistory) => [
        { question, answer: fetchedAnswer },
        ...prevHistory, // Keep the previous history, with new item on top
      ]);
    } catch (error) {
      setAnswer("Sorry, there was an issue fetching the answer.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Handle new question submission
  const handleSubmitQuestion = async (question) => {
    setSelectedQuestion(question);
    setLoading(true); // Set loading to true when fetching the answer

    try {
      const response = await fetch(
        `https://toolbox.boomlive.in/chatbot-py/query?question=${question}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get answer");
      }
      const data = await response.json();
      const fetchedAnswer = data.answer || "No answer found.";

      // Add the question-answer pair to history after the answer is fetched
      setHistory((prevHistory) => [
        { question, answer: fetchedAnswer },
        ...prevHistory, // Keep the previous history, with new item on top
      ]);

      setAnswer(fetchedAnswer);
    } catch (error) {
      setAnswer("Sorry, there was an issue fetching the answer.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Choose random icon from the array
  const getRandomIcon = (icons) => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  const questionIcons = [
    <AiFillAccountBook size={40} />, // Increased icon size
    <FaInfoCircle size={40} />,
    <FaLightbulb size={40} />,
    <FaSearch size={40} />,
    <FaComments size={40} />,
  ];

  const answerIcons = [
    <FaCheck size={40} />, // Increased icon size
    <FaReply size={40} />,
    <FaThumbsUp size={40} />,
    <FaBullseye size={40} />,
    <FaExclamationCircle size={40} />,
  ];

  // Handle answer expansion
  const handleAnswerExpand = (answer) => {
    setExpandedAnswer(answer === expandedAnswer ? null : answer); // Toggle answer expansion
  };

  return (
    <main className="trending-questions">
      <h2>Trending Questions</h2>

      {/* Display History Section */}
      {history.length > 0 && (
        <div className="history-section">
          <h3>History</h3>
          <div className="history-list">
            <ul>
              {history.map((item, index) => (
                <li key={index} className="history-card">
                  <strong>Q: </strong>
                  {item.question}
                  <br />
                  <strong>A: </strong>
                  <p
                    className="answer-preview"
                    onClick={() => handleAnswerExpand(item.answer)}
                  >
                    {expandedAnswer === item.answer
                      ? item.answer
                      : item.answer.substring(0, 100) + "..."}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      {/* Show loading state */}
      {loading ? (
        <div className="loading">
          <div className="skeleton-loader"></div>
        </div>
      ) : selectedQuestion ? (
        <div className="question-answer">
          <div className="question-content">
            <div className="question-icon">
              <img
                src="https://cdn-icons-png.flaticon.com/512/11486/11486961.png"
                alt="Question Icon"
                className="custom-icon"
              />
            </div>
            <h3>{selectedQuestion}</h3>
          </div>
          <div className="answer-content">
            <div className="answer-icon">
              <img
                src="https://cdn-icons-png.flaticon.com/512/8418/8418908.png"
                alt="Answer Icon"
                className="custom-icon"
              />
            </div>
            <p>{answer}</p>
          </div>
          <button
            onClick={() => setSelectedQuestion(null)}
            aria-label="Go back to question list"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="questions-grid">
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
                <p className="question-text">{q}</p>
              </div>
            ))
          ) : (
            <p>No questions found.</p>
          )}
        </div>
      )}

      {/* Footer Section */}
      <Footer onSubmitQuestion={handleSubmitQuestion} />
    </main>
  );
}

export default TrendingQuestions;
