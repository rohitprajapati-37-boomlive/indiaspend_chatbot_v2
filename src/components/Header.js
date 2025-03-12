import React, { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import logo from "../assets/indiaspend_logo.svg";
import {
  MdLightMode,
  MdOutlineDarkMode,
  MdMenu,
  MdClose,
} from "react-icons/md";

const Header = ({ setShowFAQ, setShowFeedback, showFAQ, showFeedback }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // References for detecting outside clicks
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Close dropdown/menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  // ✅ Properly Toggle FAQ & Feedback
  const handleShowFAQ = () => {
    setShowFAQ(true);
    setShowFeedback(false); // ✅ Feedback Close
    setIsMobileMenuOpen(false); // ✅ Mobile menu close karein
  };

  const handleShowFeedback = () => {
    setShowFAQ(false); // ✅ FAQ Close
    setShowFeedback(true);
    setIsMobileMenuOpen(false); // ✅ Mobile menu close karein
  };

  return (
    <header className="header">
      <div className="logo-container" onClick={() => window.location.reload()}>
        <img src={logo} alt="IndiaSpend Logo" className="logo" />
      </div>

      <div className="right-section">
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

        {/* <div className="user-section" ref={dropdownRef}>
          <MdPerson
            className="user-icon"
            onClick={toggleDropdown}
            aria-label="User Menu"
          />
          {showDropdown && (
            <div className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  <p>Welcome, User!</p>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button onClick={handleLogin}>Login</button>
              )}
            </div>
          )}
        </div> */}

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <MdClose size={25} /> : <MdMenu size={25} />}
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      {/* <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button> */}

      {/* Mobile Menu */}
      <nav
        className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        ref={menuRef}
      >
        <a href="https://www.indiaspend.com" target="_blank">
          IndiaSpend
        </a>
        <a href="https://www.indiaspend.com/earthcheckindia" target="_blank">
          Earthcheck India
        </a>
        <a href="https://www.indiaspend.com/education-check" target="_blank">
          Education Check
        </a>
        <a href="https://www.indiaspend.com/gendercheck" target="_blank">
          Gendercheck
        </a>
        <a href="https://www.indiaspend.com/subscribe" target="_blank">
          Newsletters
        </a>
        <a href="https://www.indiaspend.com/about-us" target="_blank">
          About
        </a>

        {/* ✅ Feedback Button */}
        <a href="#feedback" onClick={handleShowFeedback}>
          Feedback
        </a>

        {/* ✅ FAQ Button */}
        <a href="#faq" onClick={handleShowFAQ}>
          FAQ
        </a>

        <a href="#start-new-thread" onClick={() => window.location.reload()}>
          Start New Thread
        </a>
      </nav>
    </header>
  );
};

export default Header;
