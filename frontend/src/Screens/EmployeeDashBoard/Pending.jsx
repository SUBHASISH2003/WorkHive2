import React from 'react';
import '../../css/EmployeeDash/PendingTask.css'; // Import the external CSS

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
    {
      title: 'Implement Chat Feature',
      description: 'Implement real-time chat functionality for users to communicate within the app.',
      deadline: '2025-03-01',
      assignedEmployees: 5,
    },
    {
      title: 'Create Admin Dashboard',
      description: 'Design and implement an admin dashboard to manage users, tasks, and content.',
      deadline: '2025-03-05',
      assignedEmployees: 4,
    },
    {
      title: 'Refactor Legacy Code',
      description: 'Refactor legacy code to improve maintainability and readability.',
      deadline: '2025-03-10',
      assignedEmployees: 2,
    },
    {
      title: 'Integrate Third-party API',
      description: 'Integrate a third-party payment gateway API for processing payments.',
      deadline: '2025-03-12',
      assignedEmployees: 3,
    },
    {
      title: 'Conduct Code Review',
      description: 'Review the codebase for any issues, optimize code, and ensure best practices are followed.',
      deadline: '2025-03-15',
      assignedEmployees: 4,
    },
    {
      title: 'Create User Documentation',
      description: 'Create detailed user documentation for the new website and its features.',
      deadline: '2025-03-20',
      assignedEmployees: 2,
    },
    {
      title: 'Implement Security Enhancements',
      description: 'Improve the security of the application by implementing additional measures like XSS and CSRF protection.',
      deadline: '2025-03-25',
      assignedEmployees: 3,
    },
    {
      title: 'Migrate to Cloud Hosting',
      description: 'Migrate the entire web application to a cloud hosting provider for better scalability and reliability.',
      deadline: '2025-03-30',
      assignedEmployees: 5,
    },
  ];
  

const Pending = () => {
  return (
    <div className="pending-container-employee-dash">
      <h2 className="pending-title">Pending Tasks</h2>
      <div className="pending-task-list">
        {tasks.map((task, index) => (
          <div key={index} className="pending-task-card">
            <div className="pending-task-header">
              <h3 className="pending-task-title">{task.title}</h3>
              <span className="pending-task-deadline">{task.deadline}</span>
            </div>
            <p className="pending-task-description">{task.description}</p>
            <div className="pending-task-footer">
              <span className="pending-assigned-employees">
                {task.assignedEmployees} Employee(s) Assigned
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pending;
