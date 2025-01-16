import React, { useContext, useState } from "react";
import "./CSS/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/LoginContextProvider";
import axios from "axios";

export const SignUp = () => {
  const LoginPropData = useContext(LoginContext);
  const navigate = useNavigate(); // For navigation after form submission


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [dob, setDob] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState("");
  const [Error, setError] = useState(false);

  // Handle form submission
  const handleFormData = (e) => {
    e.preventDefault();

    
    if (password !== confirmPass) {
      setError(true);
      setConfirmPass("");
    } else {
      console.log({
        name,
        email,
        dob,
        password,
        organizationName,
        role,
      });
      setName("");
      setEmail("");
      setDob("");
      setOrganizationName("");
      setPassword("");
      setConfirmPass("");
      setRole("");
      setError(false);

      // Navigate to the desired route
      navigate("/login");
    }
  };

  const handlePropData = () => {
    LoginPropData.setLoginProp(true);
  };

  return (
    <div className="SignUpMain">
      <h3>Sign Up</h3>
      <form className="SignUpForm" onSubmit={handleFormData}>
        <div className="formGroup">
          <label htmlFor="name">Name: </label>
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
          <label htmlFor="email">Email ID: </label>
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
          <label htmlFor="dob">Date-Of-Birth: </label>
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Enter your date-of-birth"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password: </label>
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
          <label htmlFor="confirmPass">Confirm Password: </label>
          <input
            required
            type="password"
            name="confirmPass"
            placeholder="Confirm your password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <p className="errorText">
            {Error ? "Confirm Password and Password need to be same" : ""}
          </p>
        </div>
        
        <div className="formGroup">
          <label htmlFor="role">Organizational Role: </label>
          <select
            required
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Leader">Manager/Leader</option>
            <option value="Member">Employee/TeamMates</option>
          </select>
        </div>
        {role === "Member" && (
          <div className="formGroup">
            <label htmlFor="MemberKey">Room Key: </label>
            <input
              required
              type="text"
              name="MemberKey"
              placeholder="Enter your room key"
            />
          </div>
        )}
        {/* the organisation name of the employee will shown automatically here  */}

        {role === "Member" && (
          <div className="formGroup">
          <label htmlFor="orgName">Organization Name: </label>
          <input
            disabled
            required
            type="text"
            name="orgName"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Enter your organization / team name"
          />
        </div>
        )}

        {role === "Leader" && (
          <div className="formGroup">
          <label htmlFor="orgName">Organization Name: </label>
          <input
            required
            type="text"
            name="orgName"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Enter your organization / team name"
          />
        </div>
        )}
        <button type="submit" className="Create">
          Create
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login" onClick={handlePropData}>
          Log In
        </Link>
      </p>
      <div className="space"></div>
    </div>
  );
};
