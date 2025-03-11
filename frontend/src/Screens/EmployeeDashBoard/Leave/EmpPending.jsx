import React from "react";
import "../../../css/EmployeeDash/EmpPendingLeave.css";
import EmpCreate from "./EmpCreate";

const LeaveCard = ({ leaveType, description, totalDays, startDate, endDate }) => {
  return (
    <div className="leave-card">
      <div className="card-content">
        <div className="header">
          <h2 className="leave-type">{leaveType}</h2>
          <span className="status">Pending</span>
        </div>
        <p className="description">{description}</p>
        <div className="date-container">
          <div className="date">
            <span className="icon">📅</span>
            <span>{startDate}</span>
          </div>
          <span className="to-text">to</span>
          <div className="date">
            <span className="icon">📅</span>
            <span>{endDate}</span>
          </div>
        </div>
        <div className="total-days">
          <span className="icon">⏳</span>
          <span>{totalDays} Days</span>
        </div>
      </div>
    </div>
  );
};

const EmpPending = () => {
  return (
    <div className="emp-pending-container">
      <EmpCreate/>
      <div className="EmpPendingCardCon">
      <LeaveCard 
        leaveType="Sick Leave" 
        description="Medical leave due to illness." 
        totalDays={5} 
        startDate="2025-02-10" 
        endDate="2025-02-15" 
      />
      <LeaveCard 
        leaveType="Sick Leave" 
        description="Medical leave due to illness." 
        totalDays={5} 
        startDate="2025-02-10" 
        endDate="2025-02-15" 
      />
      <LeaveCard 
        leaveType="Sick Leave" 
        description="Medical leave due to illness." 
        totalDays={5} 
        startDate="2025-02-10" 
        endDate="2025-02-15" 
      />
      <LeaveCard 
        leaveType="Sick Leave" 
        description="Medical leave due to illness." 
        totalDays={5} 
        startDate="2025-02-10" 
        endDate="2025-02-15" 
      />
      <LeaveCard 
        leaveType="Sick Leave" 
        description="Medical leave due to illness." 
        totalDays={5} 
        startDate="2025-02-10" 
        endDate="2025-02-15" 
      />
      </div>
    </div>
  );
};

export default EmpPending;
