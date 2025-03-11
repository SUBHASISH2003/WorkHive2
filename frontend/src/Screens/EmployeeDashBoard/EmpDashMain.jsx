import React from 'react';
import '../../css/EmployeeDash/EmployeeDash.css';
import MainNav from '../../Components/NavBar/MainNav';
import ProfileCard from '../../Components/ProfileCard';
import RecentTask from './RecentTask';
import Pending from './Pending';
import RejectedTask from './RejectedTask';
import FailedTask from './FailedTask';
import CompletedTask from './CompletedTask';

const EmpDashMain = () => {

  


  return (
    <div className="EmpDashMainCon">
      <MainNav />
      <div className="EmpContent">
        <ProfileCard />
        <div className="EmployeeDetails">
          <div className="DetailsBox">
            <h3>Task Assigned</h3>
            <p>12</p>
          </div>
          <div className="DetailsBox">
            <h3>Task Completed</h3>
            <p>12</p>
          </div>
          <div className="DetailsBox">
            <h3>Overall Performance</h3>
            <p>85%</p>
          </div>
        </div>     
      </div>

      <RecentTask/>
      <Pending/>
      <RejectedTask/>
      <FailedTask/>
      <CompletedTask/>
    </div>
  );
};

export default EmpDashMain;
