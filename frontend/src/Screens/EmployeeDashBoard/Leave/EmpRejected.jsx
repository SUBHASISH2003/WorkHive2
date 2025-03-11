import React from 'react';
import '../../../css/EmployeeDash/LeaveRejected.css';

// Sample data for rejected leave requests
const leaveRequests = [
  {
    leaveType: "Sick Leave",
    description: "Was not feeling well, but leave was not approved.",
    startDate: "2025-02-05",
    endDate: "2025-02-05",
    totalDays: 1,
    status: "Rejected",
  },
  {
    leaveType: "Vacation",
    description: "Vacation request was not approved due to work commitments.",
    startDate: "2025-02-10",
    endDate: "2025-02-15",
    totalDays: 6,
    status: "Rejected",
  },
  {
    leaveType: "Personal Leave",
    description: "Request for personal leave was not granted.",
    startDate: "2025-02-20",
    endDate: "2025-02-21",
    totalDays: 2,
    status: "Rejected",
  },
];

const EmpRejected = () => {
  return (
    <div className="emp-rejected-container">
      <h2 className="emp-rejected-title">Rejected Leave Requests</h2>
      <div className="emp-rejected-cards">
        {leaveRequests.map((leave, index) => (
          <div key={index} className="emp-rejected-leave-card">
            <div className="emp-rejected-card-content">
              <div className="emp-rejected-header">
                <h3 className="emp-rejected-leave-type">{leave.leaveType}</h3>
                <span className="emp-rejected-status rejected">{leave.status}</span>
              </div>
              <p className="emp-rejected-description">{leave.description}</p>
              <div className="emp-rejected-date-container">
                <div className="emp-rejected-date">
                  <span className="emp-rejected-to-text">From:</span>
                  <span>{leave.startDate}</span>
                </div>
                <div className="emp-rejected-date">
                  <span className="emp-rejected-to-text">To:</span>
                  <span>{leave.endDate}</span>
                </div>
                <div className="emp-rejected-total-days">
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

export default EmpRejected;
