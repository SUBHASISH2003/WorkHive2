import React, { useState, useEffect } from 'react';
import '../css/Profile/Profile.css'
import axios from '../config/axiosConfig.jsx'
import { useNavigate } from 'react-router-dom';
import profile from '../assets/Images/profile.png'

const ProfileCard =() => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  
  const HandleLogout = ()=>{
    axios.get('/api/user/logout')
    .then((res)=>{
      console.log(res)
      localStorage.setItem('userRole',"")
      localStorage.setItem('token',"")
      navigate('/login')
    })
    .catch((err)=>{
      console.log(err)
    })
  }


     useEffect(() => {
        axios.get('/api/user/me')
        .then((response)=>{
            const user = response.data.user;
            console.log(user)
            setProfileData(user)
        })
        .catch((error)=>{
            console.log(error);
        })
     }, [])


     const HandleEdit = ()=>{
      navigate(`/${profileData.role}/profile/edit`)
     }
    

  if (!profileData) {
    return <div className="loading">Loading profile...</div>;
  }

  const { name, age,bio, email, managerKey, members, organizationName, profilePic } = profileData;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={profilePic || profile} alt={`${name}'s profile`} className="profile-pic" />
        <div className="profile-info">
          <h2 className="name">{name}</h2>
          <p className="age">Age: {age}</p>
          <p>Email: {email}</p>
          <p className="organization">{organizationName}</p>
        </div>
      </div>
      <div className="profile-details">
        <p className="bio">{bio}</p>
      </div>
      <div className="buttonCon">
      <button onClick={HandleEdit}>Edit</button>
      <button className='Logout' onClick={HandleLogout}>Log out</button>
      </div>
    </div>
  );
};

export default ProfileCard;
