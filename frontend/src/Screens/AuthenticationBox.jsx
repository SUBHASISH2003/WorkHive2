import React from 'react';
import "../css/AuthCss/AuthBox.css";
import BrainLite from "../assets/Images/brainLite.webp";
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const AuthenticationBox = ({ LoginPropData }) => {
  // const navigate = useNavigate()
  

  return (
    <div className="AuthBoxMain">
      <div className="AuthBox">
        <div className="AuthImg">
          <h2>{LoginPropData?.LoginProp ? "Welcome Back User" : "Join Dutio today"}</h2>
          <p>
            {LoginPropData?.LoginProp
              ? "Log in"
              : "Sign up"}{" "}
            to access personalized recommendations, amazing features, and more. It’s fast, easy, and free!
          </p>
          <img src={BrainLite} alt="Illustration of a lite brain" />
        </div>
        <div className="AuthForm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationBox;
