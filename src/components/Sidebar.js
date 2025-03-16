import React, { useState, useEffect } from "react";
// import { GoInfo } from "react-icons/fa";
// import { GoGlobe } from "react-icons/fa6";
// import { GoComment  } from "react-icons/bs";
// import { GoCrossReference } from "react-icons/ri";
// import { GoMail   } from "react-icons/md";
// import { GoSidebarCollapse } from "react-icons/tb";

// import { GoCrossReference } from "react-icons/fi";

// import { FiMenu } from "react-icons/fi";

import { BsGenderTrans } from "react-icons/bs";
import {
  GoQuestion,
  GoSidebarCollapse,
  GoSidebarExpand,
  GoCrossReference,
  GoComment,
  GoMail,
  GoInfo,
  GoRepo,
  GoGlobe,
  GoLink,
  GoXCircle,
} from "react-icons/go";

import logo from "../assets/ask_indiaspend.svg";

import "../styles/Sidebar.css";

function Sidebar({
  setShowFAQ,
  setShowFeedback,
  setShowTrendingQuestions,
  isCollapsed,
  toggleSidebar,
  startNewThread,
}) {
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ Mobile menu toggle ke liye state

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("questionHistory")) || [];
    setPreviousQuestions(storedHistory.slice(0, 5)); // Last 5 questions show karega
  }, []);

  // const toggleSidebar = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  // ✅ Start New Thread - LocalStorage se chat clear + Previous Questions dikhai de
  const handleNewThread = () => {
    const storedHistory =
      JSON.parse(localStorage.getItem("questionHistory")) || [];
    localStorage.removeItem("questionHistory"); // Chat history delete karega
    setPreviousQuestions(storedHistory.slice(0, 5)); // Purani chats dikha dega
    // window.location.reload(); // Page reload karega taki naye chat shuru ho
    setShowFAQ(false);
    setShowFeedback(false);
    setIsMobileMenuOpen(false);
    startNewThread();
  };

  return (
    <>
      {/* ☰ Menu Button (Left Side) */}
      {!isMobileMenuOpen && (
        <div
          className="mobile-menu-icon left"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <GoSidebarExpand />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar_abh ${isMobileMenuOpen ? "open" : ""}`}
        style={{ width: !isCollapsed ? "4rem" : "" }}
      >
        {/* ✖ Close Button (Right Side) */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-icon right"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <GoXCircle />
          </div>
        )}

        <div class="logoDiv">
          <div
            className="logo-container"
            onClick={() => window.location.reload()}
          >
            <img src={logo} alt="IndiaSpend Logo" className="logo" />
            {isCollapsed && <h4>Ask IndiaSpend</h4>}
          </div>
        </div>

        <div class="listbox">
          {/* <div className="sidebar-content"> */}
          <div className="sidebar_block">
            {/* Sidebar Toggle Button */}
            <p className="toggle-button sidebar-icon" onClick={toggleSidebar}>
              {isCollapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
              <span className={`sidebar-text ${isCollapsed ? "" : "hidden"}`}>
                Collapse
              </span>

              <span className={`tooltip_text ${isCollapsed ? "" : "hidden"}`}>
                Collapse
              </span>
            </p>

            <p className="new-thread-button" onClick={handleNewThread}>
              <span className="sidebar-icon">
                <GoCrossReference />{" "}
                <span className="tooltip_text">Start New Thread</span>
              </span>
              <span className={`sidebar-text ${isCollapsed ? "" : "hidden"}`}>
                Start new thread
              </span>
            </p>
          </div>
          {/* Quick Links */}
          <div className="sidebar_block">
            <div className={`ttlquicklink ${isCollapsed ? "" : "hidden"}`}>
              {isCollapsed && <h5> Quick Links</h5>}

              {[
                {
                  text: "IndiaSpend",
                  link: "https://www.indiaspend.com",
                  icon: <GoLink />,
                },
                {
                  text: "Earthcheck India",
                  link: "https://www.indiaspend.com/earthcheckindia",
                  icon: <GoGlobe />,
                },
                {
                  text: "Education Check",
                  link: "https://www.indiaspend.com/education-check",
                  icon: <GoRepo />,
                },
                {
                  text: "GenderCheck",
                  link: "https://www.indiaspend.com/gendercheck",
                  icon: <BsGenderTrans />,
                },
                {
                  text: "Newsletters",
                  link: "https://www.indiaspend.com/subscribe",
                  icon: <GoMail />,
                },
                {
                  text: "About",
                  link: "https://www.indiaspend.com/about-us",
                  icon: <GoInfo />,
                },
              ].map((item, index) => (
                <p
                  key={index}
                  className="faq-button"
                  onClick={() => {
                    window.open(item.link);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="sidebar-icon">
                    {item.icon}
                    <span className="tooltip_text">{item.text}</span>
                  </span>
                  <span
                    className={`sidebar-text ${isCollapsed ? "" : "hidden"}`}
                  >
                    {item.text}
                  </span>
                </p>
              ))}
            </div>
          </div>

          <div className="sidebar_block">
            <div className={`ttlquicklink ${isCollapsed ? "" : "hidden"}`}>
              {isCollapsed && <h5>Know More</h5>}
              <p
                className="faq-button"
                onClick={() => {
                  setShowFAQ(true);
                  setShowFeedback(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="sidebar-icon ">
                  <GoQuestion /> <span className="tooltip_text"> FAQ</span>
                </span>
                <span className={`sidebar-text ${isCollapsed ? "" : "hidden"}`}>
                  FAQ
                </span>
              </p>

              {/* Feedback Button */}
              <p
                className="faq-button faq-text"
                onClick={() => {
                  setShowFeedback(true);
                  setShowFAQ(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="sidebar-icon Feedback-ur-text">
                  <GoComment /> <span className="tooltip_text">Feedback</span>
                </span>
                <span className={`sidebar-text ${isCollapsed ? "" : "hidden"}`}>
                  Feedback
                </span>
              </p>
            </div>
          </div>

          {/* ✅ Start New Thread Button */}
          {/* <p className="new-thread-button" onClick={handleNewThread}>
          <span className="sidebar-icon">
            <GoCrossReference />
          </span>
          <span className={`sidebar-text ${isCollapsed ? "" : "hidden"}`}>
            Start new thread
          </span>
        </p> */}

          {/* ✅ Previous Questions - Click karne par Trending Questions dikhai de */}
          {isCollapsed && (
            <div className="sidebar_block">
              <div className="previous-questions">
                <h5>Previous 7 Days</h5>
                {previousQuestions.length > 0 ? (
                  <ul>
                    {previousQuestions.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => setShowTrendingQuestions(true)}
                      >
                        <p>{item.question}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <h5>No previous questions available</h5>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
