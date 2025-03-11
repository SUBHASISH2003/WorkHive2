import React, { useState, useEffect, useContext } from "react";
import axios from "../config/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import profile from "../assets/Images/profile.png";
import "../css/Profile/ProfileEdit.css";
import { UserContext } from "../context/UserContextProvider";

const ProfileEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    axios
      .get("/api/user/me")
      .then((res) => {
        const userData = res.data.user;
        setBio(userData.bio);
        setProfilePic(userData.profilePic || profile);
        setOrgName(userData.organizationName);
        setRole(userData.role);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleBioChange = (e) => setBio(e.target.value);

  const handleProfilePicChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfilePic(URL.createObjectURL(selectedFile)); // Show preview

      // Cleanup previous object URL to avoid memory leaks
      return () => URL.revokeObjectURL(profilePic);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (file) formData.append("profilePic", file);

    // Only append organizationName if the user is a Manager
    if (role === "Manager") {
      formData.append("organizationName", orgName);
    }

    try {
      const res = await axios.put("/api/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);
      setUser(res.data.user); // Update UserContext
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="profile-edit-container">
      <h2 className="profile-edit-title">Edit Profile</h2>
      <div className="profile-pic-container">
        <img src={profilePic || profile} alt="Profile" className="profile-pic" />
        <input type="file" name="profilePic" accept="image/*" onChange={handleProfilePicChange} />
      </div>
      <div className="bio-container">
        <textarea value={bio} onChange={handleBioChange} className="bio-textarea"></textarea>
      </div>
      <div className="OrgCon">
        <input
          type="text"
          disabled={role === "Employee"}
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
      </div>
      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default ProfileEdit;
