import React from 'react'
import '../../../css/EmployeeDash/EmpLeave.css'
import MainNav from '../../../Components/NavBar/MainNav'
import { Link, Outlet, useLocation } from 'react-router-dom'
const EmpLeave = () => {
  const location = useLocation()
  return (
    <div className='EmpLeaveMainCon'>
        <MainNav/>
        <div className="EmpButtonRow">
            <button className={location.pathname === '/Employee/leave/pending' ? 'ButtonActive' : ''}><Link className='ButtonLinks'  to={'/Employee/leave/pending'}>Pending</Link></button>
            <button className={location.pathname === '/Employee/leave/accepted' ? 'ButtonActive' : ''}><Link className='ButtonLinks'  to={'/Employee/leave/accepted'}>Accepted</Link></button>
            <button className={location.pathname === '/Employee/leave/rejected' ? 'ButtonActive' : ''}><Link  className='ButtonLinks' to={'/Employee/leave/rejected'}>Rejected</Link></button>
        </div>
        <Outlet/>
    </div>
  )
}

export default EmpLeave