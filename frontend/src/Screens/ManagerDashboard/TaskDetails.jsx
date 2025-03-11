import React, { useEffect, useState } from "react";
import axios from "../../config/axiosConfig.jsx";
import { useParams } from "react-router-dom";
import "../../css/ManagerDash/TaskDetails.css";

const TaskDetails = () => {
  const [taskDetails, setTaskDetails] = useState(null);
  const { taskId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/task/${taskId}`)
      .then((res) => {
        console.log(res.data);
        setTaskDetails(res.data.task);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [taskId]);

  if (!taskDetails) {
    return <div className="taskDetails-loading">Loading...</div>;
  }

  // Total assigned employees
  const totalAssigned = taskDetails.assignedEmployees.length;

  // Total employees who completed the task (status === "complete")
  const totalCompleted = taskDetails.employeeResponses.filter(
    (response) => response.status.toLowerCase() === "completed"
  ).length;

  // Total employees who failed the task (status === "failed")
  const totalFailed = taskDetails.employeeResponses.filter(
    (response) => response.status.toLowerCase() === "failed"
  ).length;

  return (
    <div className="taskDetails-container">
      <h1 className="taskDetails-title">{taskDetails.title}</h1>
      <p className="taskDetails-description">{taskDetails.description}</p>

      <div className="taskDetails-meta">
        <p className="taskDetails-deadline">
          📅 Deadline: {new Date(taskDetails.deadline).toDateString()}
        </p>
        <p className="taskDetails-type">📌 Task Type: {taskDetails.taskType}</p>
      </div>

      {/* 📊 Task Summary Section */}
      <div className="taskDetails-summary">
        <h2>📊 Task Summary</h2>
        <p>👥 Total Assigned Employees: {totalAssigned}</p>
        <p>✅ Completed Employees: {totalCompleted}</p>
        <p>❌ Failed Employees: {totalFailed}</p>
      </div>

      <div className="taskDetails-section">
        <h2>🛠 Assigned Employees</h2>
        <ul className="taskDetails-employeeList">
          {taskDetails.assignedEmployees.map((emp) => (
            <li key={emp._id} className="taskDetails-employeeCard">
              {emp.name} ({emp.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="taskDetails-section">
        <h2>✅ Employee Responses</h2>
        {taskDetails.employeeResponses.length > 0 ? (
          <ul className="taskDetails-responseList">
            {taskDetails.employeeResponses.map((response, index) => {
              // Find the corresponding employee in assignedEmployees
              const employee = taskDetails.assignedEmployees.find(
                (emp) => emp._id === response.employee
              );

              return (
                <li key={index} className="taskDetails-responseCard">
                  <p className="taskDetails-responseEmployee">
                    {employee
                      ? `${employee.name} (${employee.email})`
                      : "Unknown Employee"}
                  </p>
                  <p className="taskDetails-responseStatus">
                    📝 Status: {response.status}
                  </p>
                  <p className="taskDetails-responseText">
                    💬 Response: {response.response}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="taskDetails-noResponse">No responses yet.</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
