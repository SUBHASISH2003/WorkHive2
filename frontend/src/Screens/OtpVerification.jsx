import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/AuthCss/Otp.css";
import { UserContext } from "../context/UserContextProvider.jsx";
import axios from "../config/axiosConfig.jsx";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext); // Access user from context
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 5) {
      setErrorMessage("OTP must be 5 digits.");
      return;
    }

    try {
      const response = await axios.post("/api/user/otp-verification", {
        email: user?.email, // Ensure email is available
        otp,
      });

      console.log("OTP verification successful:", response.data);
      setErrorMessage("");
      navigate("/login"); // Navigate to login page on success
    } catch (error) {
      console.error(error);
      setErrorMessage("Wrong OTP. Please try again.");
    }
  };

  return (
    <div className="otp-verification-container">
      <h3>OTP Verification</h3>
      <p>
        An OTP has been sent to your email:{" "}
        <strong>{user?.email || "Email not available"}</strong>. Please enter it
        below to verify your account.
      </p>
      <form className="otp-form" onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength="5"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="otp-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-btn">
          Verify OTP
        </button>
      </form>
      <p className="resend-message">
        Didn’t receive the OTP? <a href="#">Resend OTP</a>
      </p>
    </div>
  );
};

export default OtpVerification;
