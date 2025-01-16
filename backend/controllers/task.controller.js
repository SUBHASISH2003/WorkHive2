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
      return res.status(403).json({ message: 'Access denied. Only admins can create tasks.' });
    }

     // Find user objects based on email addresses
     const assignedEmployeeEmails = [];
     for (const email of assignedEmployees) {
       const employee = await User.findOne({ email });
       if (!employee) {
         return res.status(404).json({ message: `Employee with email ${email} not found.` });
       }
       assignedEmployeeEmails.push(email); // Push the ObjectID of the found employee
     }

    const task = new Task({
      title,
      description,
      deadline,
      assignedEmployees: assignedEmployeeEmails,  // Store emails instead of ObjectIDs
      createdBy: req.user.email,  // Store manager's email
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
    let tasks;

    if (req.user.role === 'Manager') {
      // Managers see all tasks
      tasks = await Task.find()
        .populate('assignedEmployees', 'name email')
        .populate('createdBy', 'name email');
    } else {
      // Employees see only their assigned tasks
      tasks = await Task.find({ assignedEmployees: req.user._id })
        .populate('createdBy', 'name email');
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task status or employee response
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, response } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Allow managers to update the status or employees to add their responses
    if (req.user.role === 'admin') {
      task.status = status;
    } else {
      const employeeIndex = task.employeeResponses.findIndex(
        (resp) => resp.employee.toString() === req.user._id.toString()
      );

      if (employeeIndex === -1) {
        task.employeeResponses.push({
          employee: req.user._id,
          response,
        });
      } else {
        task.employeeResponses[employeeIndex].response = response;
      }
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
