import mongoose from 'mongoose';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';

// Create a new task (Manager only)
export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedEmployees } = req.body;
    if (!title ||!description ||!deadline ||!assignedEmployees) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user is a manager
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied. Only managers can create tasks.' });
    }

    // Fetch the manager's key
    const managerKey = req.user.managerKey;

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate < new Date()) {
      return res.status(400).json({ message: 'Invalid or past deadline.' });
    }

    // Check if all assigned employees exist
     const assignedEmployeeIds = [];
     for (const email of assignedEmployees) {
       const employee = await User.findOne({ email, role: 'Employee', linkedManagerKey: managerKey });
       if (!employee) {
         return res.status(404).json({ message: `Employee with email ${email} not found or not linked to you.` });
       }
       assignedEmployeeIds.push(employee._id); // Push the ObjectID of the found employee
     }

    const task = new Task({
      title,
      description,
      deadline: deadlineDate,
      assignedEmployees: assignedEmployeeIds,
      createdBy: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tasks (Employees see assigned tasks, Managers see all tasks)
export const getTasks = async (req, res) => {
  try {
    const { role, _id } = req.user; // Extract the user's role and email from the request

    let tasks;

    if (role === 'Manager') {
      // Manager: Fetch all tasks with selected fields
      tasks = await Task.find({ createdBy: _id })
      .populate('assignedEmployees', 'name email') 
      .populate('createdBy', 'name email')
      .populate('employeeResponses.employee', 'name email');
    } else {
      tasks = await Task.find({ assignedEmployees: _id })
      // Employees: Fetch tasks assigned to them and filter their specific response
      .populate('assignedEmployees', 'name email')
      .populate('createdBy', 'name email')
      .populate('employeeResponses.employee', 'name email');
    }

      // Update the status of expired employee responses dynamically
      tasks.forEach((task) => {
        if (task.deadline < new Date()) {
          task.employeeResponses.forEach((response) => {
            if (response.status === 'pending') {
              response.status = 'failed';
            }
          });
        }
      });
  

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Extract taskId from URL
    const { response, status } = req.body; // Extract response from request body
    const { role, _id } = req.user; // Extract user details from authenticated user

    // Fetch the task by ID

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

  // Ensure only employees can update their responses
  if (role !== 'Employee') {
    return res.status(403).json({ message: 'Only employees can update task responses.' });
  }

  // Ensure the task deadline has not passed
  if (task.deadline < new Date()) {
    return res.status(400).json({ message: 'Cannot update responses for a task with a past deadline.' });
  }

  // Update or add employee response
  const existingResponseIndex = task.employeeResponses.findIndex(
    (resp) => resp.employee.toString() === _id.toString()
  );

  if (existingResponseIndex === -1) {
    if (!response || !['accept', 'reject'].includes(response)) {
      return res.status(400).json({ message: 'Invalid response value.' });
    }
    task.employeeResponses.push({
      employee: _id,
      response,
      status: response === 'reject' ? 'failed' : 'pending',
    });
  } else {
      // Update the existing response
      const employeeResponse = task.employeeResponses[existingResponseIndex];
      employeeResponse.response = response;

      // Automatically set status to 'failed' if response is 'reject'
      if (response === 'reject') {
        employeeResponse.status = 'failed';
      }
  }

  await task.save();

  res.status(200).json({ message: 'Response updated successfully', task });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};



export const markTaskAsComplete = async (req, res) => {
  try {
    const { taskId } = req.params; // Extract the task ID from the URL
    const { _id, role } = req.user; // Get the authenticated user details

    // Ensure only employees can mark tasks as complete
    if (role !== 'Employee') {
      return res.status(403).json({ message: 'Only employees can mark tasks as complete.' });
    }

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID.' });
    }

    // Fetch the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Find the employee's response
    const employeeResponse = task.employeeResponses.find(
      (response) => response.employee.toString() === _id.toString()
    );

    // Check if the employee has responded to the task
    if (!employeeResponse) {
      return res.status(404).json({ message: 'No response found for this employee on the task.' });
    }

    // Ensure the employee's response was "accept"
    if (employeeResponse.response !== 'accept') {
      return res.status(400).json({
        message: 'You can only mark tasks as complete if your response was "accept".',
      });
    }

    // Check if the status is already "complete"
    if (employeeResponse.status === 'completed') {
      return res.status(400).json({ message: 'This task is already marked as complete.' });
    }

    // Update the status to "complete"
    employeeResponse.status = 'completed';

    // Save the updated task
    await task.save();

    res.status(200).json({
      message: 'Task marked as complete successfully.',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
