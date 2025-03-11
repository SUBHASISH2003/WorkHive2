import React from 'react';
import '../../css/EmployeeDash/FailedTask.css'; // Importing the external CSS

const tasks = [
  {
    title: 'Design New UI',
    description: 'Create a modern user interface for the new website.',
    deadline: '2025-02-10',
    assignedEmployees: 5,
  },
  {
    title: 'Fix Bug in App',
    description: 'Resolve the crash occurring on login.',
    deadline: '2025-02-12',
    assignedEmployees: 3,
  },
  {
    title: 'Develop API for User Authentication',
    description: 'Develop a secure API for user login and authentication using JWT.',
    deadline: '2025-02-15',
    assignedEmployees: 4,
  },
  {
    title: 'Write Unit Tests for Payment Module',
    description: 'Write comprehensive unit tests for the payment processing module to ensure reliability.',
    deadline: '2025-02-20',
    assignedEmployees: 2,
  },
  {
    title: 'Database Optimization',
    description: 'Optimize database queries to improve application performance.',
    deadline: '2025-02-22',
    assignedEmployees: 6,
  },
  {
    title: 'Fix UI Responsiveness Issues',
    description: 'Ensure that the website is fully responsive across all devices and screen sizes.',
    deadline: '2025-02-25',
    assignedEmployees: 3,
  },
];

const FailedTask = () => {
  return (
    <div className="failed-container-employee-dash">
      <h2 className="failed-title">Failed Tasks</h2>
      <div className="failed-task-list">
        {tasks.map((task, index) => (
          <div key={index} className="failed-task-card">
            <div className="failed-task-header">
              <h3 className="failed-task-title">{task.title}</h3>
              <span className="failed-task-deadline">{task.deadline}</span>
            </div>
            <p className="failed-task-description">{task.description}</p>
            <div className="failed-task-footer">
              <span className="failed-assigned-employees">
                {task.assignedEmployees} Employee(s) Assigned
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FailedTask;
