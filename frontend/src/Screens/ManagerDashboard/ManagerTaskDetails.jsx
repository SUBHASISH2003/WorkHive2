import React, { useEffect, useState } from "react";
import "../../css/ManagerDash/ManagerTaskDetails.css";
import axios from "../../config/axiosConfig.jsx";
import { useNavigate } from "react-router-dom";

const ManagerTaskDetails = () => {
  const [taskDetails, setTaskDetails] = useState([]);
  const navigate = useNavigate()
  const HandleDetails = (e)=>{
      console.log(e.target.value)
      navigate(`/Manager/task/${e.target.value}`)
  }

  useEffect(() => {
    axios
      .get("/api/task/get")
      .then((res) => {
        setTaskDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="manager-task-container">
      <h1 className="manager-task-header">Task Details</h1>
      {taskDetails.length > 0 ? (
        <div className="manager-task-list">
          {[...taskDetails].reverse().map((task) => (
            <div key={task._id} className="manager-task-card">
              <h2 className="manager-task-title">{task.title}</h2>
              <p className="manager-task-description">{task.description}</p>
              <p className="manager-task-deadline">
                Deadline: {new Date(task.deadline).toDateString()}
              </p>
              <p className="manager-task-type">
                Task Type: <span>{task.taskType}</span>
              </p>
              <div className="manager-task-assignees">
                <p>Assigned Employees:</p>
                <ul>
                  {task.assignedEmployees.map((emp) => (
                    <li key={emp._id}>
                      {emp.name} ({emp.email})
                    </li>
                  ))}
                </ul>
              </div>
              <p className="manager-task-creator">
                Created By: {task.createdBy.name} ({task.createdBy.email})
              </p>

                
                <button className="TaskDetBtn" value={task._id} onClick={HandleDetails}>See details</button>

            </div>
          ))}

        </div>
      ) : (
        <p className="manager-no-tasks">No tasks available</p>
      )}
    </div>
  );
};

export default ManagerTaskDetails;
