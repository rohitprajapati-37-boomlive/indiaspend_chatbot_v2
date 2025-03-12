import React, { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";
import "../styles/FeedbackForm.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    recaptchaToken: "",
  });

  const [message, setMessage] = useState("");
  const siteKey = "6LeC5tsqAAAAAC5lYukG4yRTdDviTMLuw8tvBwSo"; // Replace with your reCAPTCHA site key

  // ✅ Ensure reCAPTCHA script is loaded
  useEffect(() => {
    if (!window.grecaptcha) {
      console.error("reCAPTCHA script not loaded.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Ensure grecaptcha is available
    if (!window.grecaptcha || !window.grecaptcha.ready) {
      console.error("reCAPTCHA not loaded.");
      setMessage("❌ reCAPTCHA failed to load. Please refresh and try again.");
      return;
    }

    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(siteKey, {
          action: "submit",
        });

        const updatedFormData = { ...formData, recaptchaToken: token };

        await fetch(
          "https://script.google.com/macros/s/AKfycbzE8AnUMjDPg5u_ZmRqvoPPVlcAgYAeNv3mbAkPjbW-sbe7XASO8_tVR7ikB1Z533nu/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
          }
        );

        setMessage("✅ Your feedback has been submitted successfully!");
        setFormData({ name: "", email: "", feedback: "", recaptchaToken: "" });
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Error submitting feedback.");
      }
    });
  };

  return (
    <div className="feedback-form">
      <h2 className="text-2xl font-bold mb-2">We Value Your Feedback</h2>
      <p className="text-lg text-gray-600 mb-4">
        Help us improve by sharing your thoughts and suggestions.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="feedback"
          placeholder="Your Feedback"
          value={formData.feedback}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Submit <MdSend />
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default FeedbackForm;
