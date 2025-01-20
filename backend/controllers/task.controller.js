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
    const { role, email } = req.user; // Extract the user's role and email from the request

    let tasks;

    if (role === 'Manager') {
      // Admins: Fetch all tasks with selected fields
      tasks = await Task.find({ createdBy: email })
      .populate('assignedEmployees', 'name email')  // Populate assigned employees with name and email
      .populate('createdBy', 'name email');  // Populate manager with name and email
    } else {
      // Employees: Fetch tasks assigned to them and filter their specific response
      tasks = await Task.find(
        { assignedEmployees: email },
        'title description deadline createdBy status employeeResponses' // Select desired fields
      ).lean();

      // Filter `employeeResponses` to include only the current employee's response
      tasks = tasks.map(task => {
        task.employeeResponses = task.employeeResponses.filter(
          response => response.employee === email
        );
        return task;
      });
    }

    // Populate `createdBy` with the manager's name and email
    tasks = await Promise.all(
      tasks.map(async task => {
        const creator = await User.findOne({ email: task.createdBy }, 'name email');
        task.createdBy = creator ? { name: creator.name, email: creator.email } : null;
        return task;
      })
    );

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Extract taskId from URL
    const { response } = req.body; // Extract response from request body
    const { role, email } = req.user; // Extract user details from authenticated user

    // Fetch the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based logic for updating the task
    if (role === 'Employee') {
      // Employees can update their response
      if (!response || !['approved', 'rejected'].includes(response)) {
        return res.status(400).json({ message: 'Invalid response value' });
      }

      const existingResponseIndex = task.employeeResponses.findIndex(
        (resp) => resp.employee === email
      );

      if (existingResponseIndex === -1) {
        // Add new response
        task.employeeResponses.push({
          employee: email,
          response,
        });
      } else {
        // Update existing response
        task.employeeResponses[existingResponseIndex].response = response;
      }

      await task.save();

      return res.status(200).json({
        message: 'Response updated successfully',
        task: {
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          createdBy: task.createdBy,
          employeeResponses: task.employeeResponses,
        },
      });
    } else {
      // Managers are not authorized to update tasks via this endpoint
      return res.status(403).json({
        message: 'Managers are not authorized to update tasks via this endpoint',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

