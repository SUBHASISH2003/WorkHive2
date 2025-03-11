import React, { useState } from 'react'
import '../../css/ManagerDash/DashBoard.css'
import MainNav from '../../Components/NavBar/MainNav'
import CreateTask from '../../Screens/ManagerDashboard/CreateTask'
import ManagerTaskDetails from './ManagerTaskDetails'
import books from '../../assets/Images/books.png'
import axios from '../../config/axiosConfig.jsx'
import ProfileCard from '../../Components/ProfileCard.jsx'


const ManagerDashMain = () => {

  const [totalTask, setTotalTask] = useState("")
  const [member, setMember] = useState("")
  const [key, setKey] = useState("")
  axios.get('/api/user/me')
  .then((res)=>{
    setTotalTask(res.data.user.totalNoOfTaskCreated)
    setMember(res.data.user.noOfLinkedEmp)
    setKey(res.data.user.managerKey)
  })
  .catch((error)=>{
    console.log(error)
  })
  return (
    <div className='DashBoardMainScreen'>
      <MainNav/>
      {/* <video src={bgVideo} autoPlay muted loop></video> */}
      <div className="DashContainer">
        {/* <ProfileCard/> */}
        <ProfileCard/>
        <div className="ManagerDetails">
          <div className="DetailsBox">
            <h3>Total Task</h3>
            <p>{totalTask}</p>
          </div>
          <div className="DetailsBox">
            <h3>Room Members</h3>
            <p>{member}</p>
          </div>
          <div className="DetailsBox">
            <h3>Room Key</h3>
            <p>{key}</p>
          </div>
        </div>
        <div className="createTaskCon">
          <img src={books} alt="books" />
        <CreateTask/>
        </div>

        <ManagerTaskDetails/>
      </div>
    </div>
  )
}

export default ManagerDashMain