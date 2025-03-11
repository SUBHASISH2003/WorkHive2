import React, { useState, useEffect } from 'react';
import '../../../css/ManagerDash/Rejected.css';
import axios from '../../../config/axiosConfig'
const Rejected = () => {
  const [rejectedData, setRejectedData] = useState([]);

  useEffect(() => {
    // Mock API call or fetch from your backend
    axios.get("/api/leave/status/rejected")
    .then((res)=>{
      setRejectedData(res.data)
    })
    .catch((err)=>{
      
    })
    
  }, []);

  return (
    <div className="rejected-container">
      <h2>Rejected List</h2>
      <table className="rejected-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Leave Type</th>
            <th>Leave Duration (Days)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rejectedData.length > 0 ?(
            rejectedData.map((entry) => (
              <tr key={entry.id}>
                <td data-label="Profile">
                  <img src={entry.profilePic} alt={entry.name} className="profile-pic" />
                </td>
                <td data-label="Name">{entry.name}</td>
                <td data-label="Email">{entry.email}</td>
                <td data-label="Leave Type">{entry.leaveType}</td>
                <td data-label="Leave Duration">{Math.ceil((new Date(entry.endDate) - new Date(entry.startDate))/(100*60*60*24))}</td>
                <td data-label="Status">
                  <span className="RejectedStatus">{entry.status}</span>
                </td>
              </tr>
            ))
          ):(<h3>No Data Available </h3>)}
        </tbody>
      </table>
    </div>
  );
};

export default Rejected;
