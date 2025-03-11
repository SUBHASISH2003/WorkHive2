import React, { useContext, useState } from "react";
import "../css/AuthCss/ResetPassword.css";
import axios from '../config/axiosConfig.jsx'
import {UserContext} from "../context/UserContextProvider.jsx";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const {user} = useContext(UserContext)
  const navigate = useNavigate()
  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

   
    // Here, you can send the password to the backend
    axios.put('/api/user/password/set-new',{
      email:user.email,
      password:newPassword,
      confirmPassword:confirmPassword
    })
    .then((res)=>{
      console.log(res)
      setMessage({ type: "success", text: "Password reset successfully!" });
      navigate('/login')
    })
    .catch((error)=>{
      console.log(error)
      console.log(user.email)
      setMessage({type:"error",text:"There is an error in reseting password"})
    })


  };

  return (
    <div className="password-container">
      <div className="password-box">
        <h2>Create Your Password</h2>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Enter your New Password" 
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="Confirm your Password" 
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <button className="button" onClick={handleReset}>Reset Password</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
