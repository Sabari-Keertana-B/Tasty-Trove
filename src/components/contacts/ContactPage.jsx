import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./contactpage.scss";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    emailjs
      .send("service_a1cszcj", "template_k80ikck", templateParams, "qpnlbiVgrO-PX8Ckg")
      .then(
        (response) => {
          console.log("Success!", response);
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Failed to send:", error);
          setStatus("Failed to send message. Try again later.");
        }
      );
  };

  return (
    <div className="contact-page">
      {/* Logo and App Name Outside the Container */}
      <div className="logo-container">
        <img src="logo.png" alt="App Logo" className="logo" />
        <span className="app-name">Tasty Trove</span>
      </div>

      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>We value your feedback and suggestions. Let us know what you think!</p>

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
            name="message"
            placeholder="Your Feedback, Suggestions, or Review"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
};

export default ContactPage;
