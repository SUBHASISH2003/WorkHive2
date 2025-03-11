import React from 'react';
import '../../../css/EmployeeDash/LeaveAccepted.css';

// Sample data for accepted leave requests
const leaveRequests = [
  {
    leaveType: "Sick Leave",
    description: "Feeling unwell, taking a day off for rest.",
    startDate: "2025-02-05",
    endDate: "2025-02-05",
    totalDays: 1,
    status: "Accepted",
  },
  {
    leaveType: "Vacation",
    description: "Going on vacation to relax and recharge.",
    startDate: "2025-02-10",
    endDate: "2025-02-15",
    totalDays: 6,
    status: "Accepted",
  },
  {
    leaveType: "Personal Leave",
    description: "Attending a personal event.",
    startDate: "2025-02-20",
    endDate: "2025-02-21",
    totalDays: 2,
    status: "Accepted",
  },
];

const EmpAccepted = () => {
  return (
    <div className="emp-accepted-container">
      <h2 className="emp-accepted-title">Accepted Leave Requests</h2>
      <div className="emp-accepted-cards">
        {leaveRequests.map((leave, index) => (
          <div key={index} className="emp-accepted-leave-card">
            <div className="emp-accepted-card-content">
              <div className="emp-accepted-header">
                <h3 className="emp-accepted-leave-type">{leave.leaveType}</h3>
                <span className="emp-accepted-status accepted">{leave.status}</span>
              </div>
              <p className="emp-accepted-description">{leave.description}</p>
              <div className="emp-accepted-date-container">
                <div className="emp-accepted-date">
                  <span className="emp-accepted-to-text">From:</span>
                  <span>{leave.startDate}</span>
                </div>
                <div className="emp-accepted-date">
                  <span className="emp-accepted-to-text">To:</span>
                  <span>{leave.endDate}</span>
                </div>
                <div className="emp-accepted-total-days">
                  <span>Total Days:</span>
                  <span>{leave.totalDays}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpAccepted;
