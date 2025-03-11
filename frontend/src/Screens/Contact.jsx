import React, { useState } from "react";
import "../css/Contact/Contact.css";
import mobile from "../assets/Images/mobilePhones.webp";
import axios from '../config/axiosConfig.jsx';

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // For status messages

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Clear previous status message
    setStatusMessage("");

    // Make the POST request only when the form is submitted
    axios
      .post('/api/contact/contact', {
        name,
        email,
        message,
      })
      .then((res) => {
        console.log(res);
        // Reset form fields after submission
        setName("");
        setEmail("");
        setMessage("");
        // Set success message
        setStatusMessage("Your inquiry has been submitted successfully.");
      })
      .catch((err) => {
        console.log(err);
        // Set error message
        setStatusMessage("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="contact-container">
      <section className="about-contact">
        <div className="about-section">
          <h2>About Us</h2>
          <p>
            Welcome to our company! We are committed to providing the best
            services and solutions tailored to your needs. With years of
            experience and a passionate team, we strive for excellence in
            everything we do.
          </p>
          <h3>Our Location</h3>
          <p>Sreenagar West, New Garia, Kolkata - 700094</p>
          <div className="map-container">
            <iframe
              title="location-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14730.265495748533!2d88.40717154796643!3d22.459731179160584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027151b7c45c8f%3A0x7f826a6df0785e6!2sSreenagar%20West%2C%20New%20Garia%2C%20Kolkata%2C%20West%20Bengal%20700094!5e0!3m2!1sen!2sin!4v1706845830123!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <div className="contact-form">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Your Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="Your Message"
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
          {statusMessage && (
            <div className={`status-message ${statusMessage.includes('successfully') ? 'success' : 'error'}`}>
              {statusMessage}
            </div>
          )}
          <div className="imgSection">
            <img src={mobile} alt="mobilePhone" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
