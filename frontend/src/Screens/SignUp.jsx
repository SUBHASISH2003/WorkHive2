import React, { useState, useContext } from "react";
import "../css/AuthCss/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig.jsx";
import { UserContext } from "../context/UserContextProvider.jsx";

export const SignUp = () => {
  const { setUser } = useContext(UserContext); 
  const navigate = useNavigate(); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [dob, setDob] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRoomKeyChange = async (e) => {
    const key = e.target.value;
    setRoomKey(key);

    if (key) {
      try {
        const response = await axios.post("/api/user/getorgname", { managerKey: key });
        setOrganizationName(response.data.orgName || "");
        setErrorMessage("");
      } catch (error) {
        setOrganizationName("");
        setErrorMessage("Invalid room key. Please check and try again.");
      }
    } else {
      setOrganizationName("");
    }
  };

  const handleFormData = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPass) {
      setErrorMessage("Confirm password must be the same as the password.");
      setConfirmPass("");
      return;
    }
  
    if (!role) {
      setErrorMessage("Please select a role.");
      return;
    }
  
    if (role === "Employee" && !roomKey) {
      setErrorMessage("Room key is required for members.");
      return;
    }
  
    // Construct payload based on role
    const payload = {
      name,
      email,
      password,
      confirmPassword: confirmPass,
      role,
      DateOfBirth: dob,
      ...(role === "Manager"
        ? { organizationName } // Include organizationName for managers
        : { managerKey: roomKey }) // Include managerKey for employees
    };
  
    try {
      const response = await axios.post("/api/user/register", payload);
      console.log("Response from server:", response);
      setUser({
        email,
        role,
      })
      //navigate to otp verification
      navigate("/otpverification");
    } catch (error) {
      console.error("Message from server:", error);
      setErrorMessage(error.response?.data?.message || "Registration failed.");
    }
  
    // Reset form fields
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPass("");
    setDob("");
    setOrganizationName("");
    setRole("");
    setRoomKey("");
    setErrorMessage("");
  };
  
  return (
    <div className="SignUpMain">
      <h3>Sign Up</h3>
      <form className="SignUpForm" onSubmit={handleFormData}>
        <div className="formGroup">
          <label htmlFor="name">Name:</label>
          <input
            required
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Email ID:</label>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password:</label>
          <input
            required
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="confirmPass">Confirm Password:</label>
          <input
            required
            type="password"
            name="confirmPass"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
        {errorMessage && <p className="errorText">{errorMessage}</p>}
        <div className="formGroup">
          <label htmlFor="role">Organizational Role:</label>
          <select
            required
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager/Leader</option>
            <option value="Employee">Employee/Member</option>
          </select>
        </div>
        {role === "Employee" && (
          <div className="formGroup">
            <label htmlFor="roomKey">Room Key:</label>
            <input
              required
              type="text"
              name="roomKey"
              value={roomKey}
              onChange={handleRoomKeyChange}
              placeholder="Enter your room key"
            />
          </div>
        )}
        {(role === "Manager" || role === "Employee") && (
          <div className="formGroup">
            <label htmlFor="orgName">Organization Name:</label>
            <input
              required={role === "Manager"}
              disabled = {role == "Employee"}
              type="text"
              name="orgName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Enter your organization/team name"
            />
          </div>
        )}
        <button type="submit" className="Create">
          Create
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
      <div className="space"></div>
    </div>
  );
};
