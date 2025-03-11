import React, { useState } from 'react';
import '../../css/EmployeeDash/RecentTask.css'; // Importing the external CSS

const RecentTask = () => {
  const tasks = [
    { id: 1, type: 'Development', description: 'Build login authentication for the new website, including security features and integration with third-party services for validation. Ensure that the login process is secure and user-friendly.', deadline: '2025-02-10', assignedEmployees: 5 },
    { id: 2, type: 'Design', description: 'Create UI for dashboard with responsive layout and user-friendly interface, ensuring accessibility and smooth user experience on both desktop and mobile devices.', deadline: '2025-02-12', assignedEmployees: 3 },
    { id: 3, type: 'Testing', description: 'Perform unit tests to ensure all features are working as expected and document results, ensuring code coverage is maintained and that the application is bug-free.', deadline: '2025-02-15', assignedEmployees: 4 },
    { id: 4, type: 'Development', description: 'Implement API endpoints for handling user data and authentication requests, including login, registration, and session management, ensuring secure communication and error handling.', deadline: '2025-02-18', assignedEmployees: 6 },
    { id: 5, type: 'Design', description: 'Improve landing page UI with new graphics and smoother navigation features, aiming for a more modern, interactive look to enhance user engagement and increase conversions.', deadline: '2025-02-20', assignedEmployees: 2 },
    { id: 6, type: 'Testing', description: 'End-to-end testing, verifying that the app performs correctly under multiple use cases, testing various user flows and ensuring performance under load.', deadline: '2025-02-22', assignedEmployees: 3 },
  ];

  const [expandedTask, setExpandedTask] = useState(null);

  // Toggle task description visibility
  const toggleDescription = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <div className="recent-tasks-container">
      <h3>Recent Assigned Tasks</h3>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h4 className="task-title">{task.type}</h4>
              <span className="task-deadline">{task.deadline}</span>
            </div>
            <p className={`task-description ${expandedTask === task.id ? 'expanded' : ''}`}>
              {expandedTask === task.id ? task.description : `${task.description.substring(0, 150)}...`}
            </p>
            <button className="show-more-btn" onClick={() => toggleDescription(task.id)}>
              {expandedTask === task.id ? 'Show Less' : 'Show More'}
            </button>
            <div className="task-footer">
              <span className="assigned-employees">
                {task.assignedEmployees} Employee(s) Assigned
              </span>
              <div className="task-actions">
                <button className="accept-btn">Accept</button>
                <button className="reject-btn">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTask;
