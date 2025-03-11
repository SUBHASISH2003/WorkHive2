import React from 'react';
import MainNav from '../../../Components/NavBar/MainNav';
import '../../../css/EmployeeDash/Room.css';

const EmployeeRoom = () => {
  // Sample data for manager and employees
  const manager = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    age: 45,
    organization: 'Dutio',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg', // Local image
  };
  
  const employees = [
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      age: 30,
      organization: 'Dutio',
      profilePic: 'https://randomuser.me/api/portraits/women/2.jpg', // Local image
    },
    {
      name: 'Bob Brown',
      email: 'bob@example.com',
      age: 32,
      organization: 'Dutio',
      profilePic: 'https://randomuser.me/api/portraits/women/2.jpg', // Local image
    },
    // Add more employees as needed
  ];
  

  return (
    <div className="employee-room">
      <MainNav />

      {/* Manager Section */}
      <div className="manager-section">
        <h2>Manager</h2>
        <div className="manager-card">
          <img src={manager.profilePic} alt={manager.name} className="profile-pic" />
          <div className="manager-details">
            <h3>{manager.name}</h3>
            <p>Email: {manager.email}</p>
            <p>Age: {manager.age}</p>
            <p>Organization: {manager.organization}</p>
          </div>
        </div>
      </div>

      {/* Employees Section */}
      <div className="employees-section">
        <h2>Employees</h2>
        <div className="employees-list">
          {employees.map((employee, index) => (
            <div key={index} className="employee-card">
              <img src={employee.profilePic} alt={employee.name} className="profile-pic" />
              <div className="employee-details">
                <h3>{employee.name}</h3>
                <p>Email: {employee.email}</p>
                <p>Age: {employee.age}</p>
                <p>Organization: {employee.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeRoom;
