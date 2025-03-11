import React, { useContext, useState } from "react";
import "../css/AuthCss/OtpVal.css"; 
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../context/UserContextProvider";
const OtpValidation = () => {
  const {setUser} = useContext(UserContext);
    const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const HandleOtp = () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    axios.post("/api/user/password/forgot", { email })
      .then((res) => {
        console.log(res);
        setMessage({ type: "success", text: "OTP sent successfully!" });
      })
      .catch((err) => {
        console.log(err);
        setMessage({ type: "error", text: "Failed to send OTP. Try again." });
      });
  };

  const HandleVerify = () => {
    if (!otp) {
      setMessage({ type: "error", text: "Please enter the OTP." });
      return;
    }

    axios.post("/api/user/password/validate-otp", { email, otp })
      .then((res) => {
        console.log(res);
        setMessage({ type: "success", text: "OTP verified successfully!" });
        setUser({
          email:email
        })
        // navigation logic here

        navigate('/password/reset')
      })
      .catch((err) => {
        console.log(err);
        setMessage({ type: "error", text: "Invalid OTP. Please try again." });
      });
  
  
  
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify Your Email</h2>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="input-group">
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field" 
          />

          <div className="otp-inputs">
            <input 
              type="text"
              className="otp-val"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP here"
            />
          </div>

          <button className="button" onClick={HandleOtp}>Send OTP</button>
          <button className="button verify-button" onClick={HandleVerify}>Verify OTP</button>
        </div>
      </div>
    </div>
  );
};

export default OtpValidation;
