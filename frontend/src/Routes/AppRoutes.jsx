import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Login } from "../Screens/Login";
import { SignUp } from "../Screens/SignUp";
import AuthenticationBox from "../Screens/AuthenticationBox";
import UserContextProvider from "../context/UserContextProvider";
import OtpVerification from "../Screens/OtpVerification";
import ResetPassword from "../Screens/ResetPassword";
import ManagerDashMain from '../Screens/ManagerDashboard/ManagerDashMain'
import EmpDashMain from '../Screens/EmployeeDashBoard/EmpDashMain'
import ProfileEdit from '../Components/ProfileEdit.jsx'
import TaskDetails from "../Screens/ManagerDashboard/TaskDetails";
import OtpValidation from '../Screens/OtpValidation.jsx'
import ManagerRoom from "../Screens/ManagerDashboard/Room/ManagerRoom.jsx";
import ManagerLeaveMain from "../Screens/ManagerDashboard/Leave/ManagerLeaveMain.jsx";
import Pending from '../Screens/ManagerDashboard/Leave/Pending.jsx'
import Rejected from '../Screens/ManagerDashboard/Leave/Rejected.jsx'
import Accepted from '../Screens/ManagerDashboard/Leave/Accepted.jsx'
import Contact from "../Screens/Contact.jsx";
import EmployeeRoom from "../Screens/EmployeeDashBoard/Room/EmployeeRoom.jsx";
import EmpLeave from "../Screens/EmployeeDashBoard/Leave/EmpLeave.jsx";
import EmpPending from "../Screens/EmployeeDashBoard/Leave/EmpPending.jsx";
import EmpCreate from '../Screens/EmployeeDashBoard/Leave/EmpCreate.jsx'
import EmpAccepted from '../Screens/EmployeeDashBoard/Leave/EmpAccepted.jsx'
import EmpRejected from '../Screens/EmployeeDashBoard/Leave/EmpRejected.jsx'
const AppRoutes = () => {
  return (
    <React.StrictMode>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthenticationBox />}>
              <Route index element={<SignUp />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="/otpverification" element={<OtpVerification/>}/>
            <Route path="/otpvalidation" element={<OtpValidation/>}/>
            <Route path="/password/reset" element={<ResetPassword/>}/>
            <Route path="/Manager/dashboard" element={<ManagerDashMain/>}></Route>
            <Route path="/Employee/dashboard" element={<EmpDashMain/>}></Route>

            <Route path="/Manager/profile/edit" element={<ProfileEdit/>}></Route>
            <Route path="/Manager/task/:taskId" element={<TaskDetails/>}></Route>
            <Route path="/Manager/room" element={<ManagerRoom/>}/>
            <Route path="/Manager/leave" element={<ManagerLeaveMain/>}>
              <Route path="pending" element={<Pending/>}/>
              <Route path="accepted" element={<Accepted/>}/>
              <Route path="rejected" element={<Rejected/>}/>
            </Route>
            <Route path="/Employee/profile/edit" element={<ProfileEdit/>}/>
            <Route path="/Employee/room" element={<EmployeeRoom/>}/>
            <Route path="/Employee/leave" element={<EmpLeave/>}>
              <Route path="pending" element={<EmpPending/>}/>
              <Route path="Accepted" element={<EmpAccepted/>}/>
              <Route path="Rejected" element={<EmpRejected/>}/>
            </Route>
            <Route path="/contact" element={<Contact/>}/>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </React.StrictMode>
  );
};

export default AppRoutes;
