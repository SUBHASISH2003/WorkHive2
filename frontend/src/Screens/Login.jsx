import React, { useState,useContext } from "react";
import "../css/AuthCss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import {UserContext} from "../context/UserContextProvider";
import axios from '../config/axiosConfig.jsx'

export const Login = () => {

  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {setUser} = useContext(UserContext);
  const handleFormData = (e) => {
    e.preventDefault();

    if (!role) {
      setErrorMessage("Please select a role.");
      return;
    }

    axios.post('/api/user/login', {
    email,
    password,
    role
  })
  .then((response) => {
    const { user, token } = response.data; 
    setRole(user.role);
    localStorage.setItem('userRole', JSON.stringify(user.role));
    localStorage.setItem('token',JSON.stringify(token));
    localStorage.setItem('roomKey',user.managerKey)
    const storedUserData = localStorage.getItem('userRole');
    console.log(storedUserData);
    setUser(user);
    
    
    navigate(`/${user.role}/dashboard`);
  
    console.log(response);
  })
  .catch((error) => {
      console.log("Server error:", error);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    });


    setEmail("");
    setPassword("");
    setRole("");
    setErrorMessage("");
  };

  return (
    <div className="LoginMain">
      <h3>Log in</h3>
      <form className="LoginForm" onSubmit={handleFormData}>
        <div className="LoginformGroup">
          <label htmlFor="email">Email ID:</label>
          <input
            required
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="LoginformGroup">
          <label htmlFor="password">Password:</label>
          <input
            required
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="LoginformGroup">
          <label htmlFor="role">Organizational Role:</label>
          <select
            required
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager/Leader</option>
            <option value="Employee">Employee/TeamMates</option>
          </select>
        </div>
        {errorMessage && <p className="errorText">{errorMessage}</p>}
        <button type="submit" className="Create">
          Log in
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/">Create Account</Link>
      </p>
      <p ><Link to="/otpvalidation" className="forgotPassLink">Forgot password?</Link> </p>
    </div>
  );
};
