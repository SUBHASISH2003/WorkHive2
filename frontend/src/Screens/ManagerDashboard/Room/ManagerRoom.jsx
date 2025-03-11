import React, { useEffect, useState } from "react";
import MainNav from "../../../Components/NavBar/MainNav";
import "../../../css/ManagerDash/ManagerRoom.css";
import axios from "../../../config/axiosConfig";
import profile from "../../../assets/Images/profile.png";
const ManagerRoom = () => {
  const [employees, setEmployees] = useState([]);
  const [key, setKey] = useState(null); // Start as null

  // Get roomKey from localStorage on mount

  // Fetch employees once key is set
  useEffect(() => {
    // Ensure key is valid
    let storedKey = localStorage.getItem("roomKey");

    setKey((storedKey = storedKey.replace(/"/g, "").trim()));
    console.log("Fetching data for roomKey:", key);
    axios
      .get(`/api/user/room/details/${key}`)
      .then((res) => {
        console.log("API Response:", res);
        setEmployees(res.data.data.employees || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [key]); // Re-run when key changes

  return (
    <div className="ManagerRoomMainCon">
      <MainNav />
      <div className="manager-room">
        <h1>Manager Room</h1>
        <div className="employee-grid">
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <div className="employeeManager-card" key={index}>
                <img
                  src={employee.profilePic ? employee.profilePic : profile}
                  alt={employee.name}
                  className="profile-pic"
                />
                <h2>{employee.name}</h2>
                <p className="email">{employee.email}</p>
                <h3 className={`performance ${employee.grade.toLowerCase()}`}>
                  {employee.grade} Performance
                </h3>

                <p>
                  <strong>performace: </strong> {employee.performance}
                </p>
                <div className="task-info">
                  <p>
                    <strong>Accepted:</strong> {employee.totalAcceptedTasks}
                  </p>
                  <p>
                    <strong>Rejected:</strong> {employee.totalRejectedTasks}
                  </p>
                  <p>
                    <strong>Completed:</strong> {employee.totalCompletedTasks}
                  </p>
                  <p>
                    <strong>Pending:</strong> {employee.totalPendingTasks}
                  </p>
                  <p>
                    <strong>Failed:</strong> {employee.totalFailedTasks}
                  </p>
                </div>
                <button className="removeEmployee">Remove</button>
              </div>
            ))
          ) : (
            <p>No employees found in this room.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerRoom;
