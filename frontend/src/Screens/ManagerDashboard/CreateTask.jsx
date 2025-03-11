import React, { useEffect, useState } from 'react';
import '../../css/ManagerDash/CreateTask.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig.jsx';

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [taskType, setTaskType] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([])
  const [key, setKey] = useState("")

  axios.get('/api/user/me')
  .then((res)=>{
    setKey(res.data.user.managerKey)
  })
  .catch((err)=>{
    console.log(err)
  })
  
      
    
  
  

  const toggleModal = () => {
    setShowModal(!showModal);
    axios.get(`/api/user/room/details/${key}`)
      .then((res)=>{
        console.log(res)
        setEmployees(res.data.data.employees)
      })
      .catch((err)=>{
        console.log(err)
      })

  };

  const handleEmployeeSelect = (employeeEmail) => {
    if (!assignedEmployees.includes(employeeEmail)) {
      setAssignedEmployees([...assignedEmployees, employeeEmail]);
    } else {
      setAssignedEmployees(assignedEmployees.filter(email => email !== employeeEmail));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/task/create', {
      title,
      description,
      deadline,
      taskType,
      assignedEmployees
    })
    .then((res) => {
      console.log(res);
      setTitle("");
      setDescription("");
      setDeadline("");
      setTaskType("");
      setAssignedEmployees([]);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="create-task-main">
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input type="text" id="title" name="title" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea id="description" name="description" placeholder="Enter task description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input type="date" id="deadline" name="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="taskType">Task Type</label>
          <select id="taskType" name="taskType" value={taskType} onChange={(e) => setTaskType(e.target.value)} required>
            <option value="" disabled>Select task type</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Design">Design</option>
            <option value="Research">Research</option>
          </select>
        </div>
        <button type="button" className="submit-button" onClick={toggleModal}>Select Employees</button>
        <div className="form-group">
          <label htmlFor="Employee">Total Employees Assigned</label>
          <input type="text" id="Employee" name="Employee" value={assignedEmployees.length} disabled />
        </div>
        <button type="submit" className="submit-button">Done</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Employees</h3>
            <ul>
              {employees.map((employee) => (
                <li key={employee.email}>
                  <label>
                    <input
                      type="checkbox"
                      checked={assignedEmployees.includes(employee.email)}
                      onChange={() => handleEmployeeSelect(employee.email)}
                    />
                    {employee.name} - {employee.email}
                  </label>
                </li>
              ))}
            </ul>
            <button className="close-button" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;
