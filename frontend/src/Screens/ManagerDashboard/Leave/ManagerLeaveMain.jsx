import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MainNav from '../../../Components/NavBar/MainNav';
import '../../../css/ManagerDash/ManagerLeave.css';

const ManagerLeaveMain = () => {
  const location = useLocation(); // Get current route

  return (
    <div className='ManagerLeaveMainCon'>
      <MainNav />
      <div className="buttonRow">
        <button className={location.pathname === '/Manager/leave/pending' ? 'ButtonActive' : ''}>
          <Link className='link' to='/Manager/leave/pending'>Pending</Link>
        </button>
        <button className={location.pathname === '/Manager/leave/accepted' ? 'ButtonActive' : ''}>
          <Link className='link' to='/Manager/leave/accepted'>Accepted</Link>
        </button>
        <button className={location.pathname === '/Manager/leave/rejected' ? 'ButtonActive' : ''}>
          <Link className='link' to='/Manager/leave/rejected'>Rejected</Link>
        </button>
      </div>
      <div className="leaveCards">
        <Outlet />
      </div>
    </div>
  );
}

export default ManagerLeaveMain;
