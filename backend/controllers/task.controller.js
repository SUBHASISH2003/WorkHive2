import mongoose from 'mongoose';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { updateUserPerformance } from '../automation/updateUserPerformance.js';
import { sendEmail } from '../utils/sendEmail.js';

// Create a new task (Manager only)
export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, taskType, assignedEmployees } = req.body;
    if (!title ||!description ||!deadline ||!assignedEmployees ||!taskType) {
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
     const employeeEmails = []; // To store the email addresses for sending email later

     for (const email of assignedEmployees) {
       const employee = await User.findOne({ email, role: 'Employee', linkedManagerKey: managerKey });
       if (!employee) {
         return res.status(404).json({ message: `Employee with email ${email} not found or not linked to you.` });
       }
       assignedEmployeeIds.push(employee._id); // Push the ObjectID of the found employee
       employeeEmails.push(employee.email); // Store employee's email for sending notification
     }

    const task = new Task({
      title,
      description,
      deadline: deadlineDate,
      taskType,
      assignedEmployees: assignedEmployeeIds,
      createdBy: req.user._id,
      totalNoOfAssignEmp: assignedEmployeeIds.length,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalNoOfTaskCreated: 1 } });

      // Update assigned employees' totalNoOfAssignTask count
      await User.updateMany(
        { _id: { $in: assignedEmployeeIds } },
        { $inc: { totalNoOfAssignTask: 1 } }
      );

    await task.save();

    // Send email to each assigned employee
for (const email of employeeEmails) {
  const subject = `New Task Assigned: ${title}`;
  const message = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #71C9CE; text-align: center;">New Task Assigned</h2>
        <p style="font-size: 16px; line-height: 1.6; text-align: center;">You have been assigned a new task by your manager:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd;">
          <p><strong style="color: #71C9CE;">Task Title:</strong> ${title}</p>
          <p><strong style="color: #71C9CE;">Description:</strong> ${description}</p>
          <p><strong style="color: #71C9CE;">Task Type:</strong> ${taskType}</p>
          <p><strong style="color: #71C9CE;">Deadline:</strong> ${deadline}</p>
        </div>
        
        <p style="font-size: 16px; text-align: center;">Please log in to your account for further details and updates on the task.</p>

        <p style="font-size: 14px; text-align: center; margin-top: 30px; color: #777;">If you have any questions, feel free to contact your manager.</p>
      </div>
       <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>DUTIO Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;

  await sendEmail({ email, subject, message });
}



    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tasks (Employees see assigned tasks, Managers see all tasks)
export const getTasks = async (req, res) => {
  try {
    const { role, _id } = req.user; // Extract user role and ID from request

    let tasks;

    if (role === 'Manager') {
      // Manager: Fetch tasks they created with full details
      tasks = await Task.find({ createdBy: _id })
        .populate('assignedEmployees', 'name email')
        .populate('createdBy', 'name email')
        .populate('employeeResponses.employee', 'name email');
    } 
    
    else if (role === 'Employee') {
      // Employee: Fetch only assigned tasks & exclude employeeResponses
      tasks = await Task.find({ assignedEmployees: _id })
        .populate('assignedEmployees', 'name email')
        .populate('createdBy', 'name email')
        .select('-employeeResponses'); // Exclude employeeResponses
    } 
    
    else {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Extract taskId from URL
    const { response } = req.body; // Extract response from request body
    const { role, _id } = req.user; // Extract user details from authenticated user

    // Validate Task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    // Fetch Task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure Only Employees Can Respond
    if (role !== 'Employee') {
      return res.status(403).json({ message: 'Only employees can update task responses.' });
    }

    // Ensure Task Deadline is Not Passed
    if (task.deadline < new Date()) {
      return res.status(400).json({ message: 'Cannot update responses for a task with a past deadline.' });
    }

    // Validate Response
    if (!response || !['accept', 'reject'].includes(response)) {
      return res.status(400).json({ message: 'Invalid response value. Allowed values: accept, reject.' });
    }

    // Find Existing Response
    const existingResponseIndex = task.employeeResponses.findIndex(
      (resp) => resp.employee.toString() === _id.toString()
    );

    if (existingResponseIndex !== -1) {
      const employeeResponse = task.employeeResponses[existingResponseIndex];

      // Prevent Changing Response Once Set
      if (employeeResponse.response) {
        return res.status(400).json({ message: 'You cannot change your response once submitted.' });
      }
    }
    if (existingResponseIndex === -1) {
      task.employeeResponses.push({
        employee: _id,
        response,
        status: response === 'reject' ? 'failed' : 'pending',
      });
    }

    await task.save();
    await updateUserPerformance(_id);

    return res.status(200).json({ message: 'Response updated successfully', task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const markTaskAsComplete = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { _id, role } = req.user;

    if (role !== "Employee") {
      return res.status(403).json({ message: "Only employees can mark tasks as complete." });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const employeeResponse = task.employeeResponses.find(
      (response) => response.employee.toString() === _id.toString()
    );

    if (!employeeResponse) {
      return res.status(404).json({ message: "No response found for this employee on the task." });
    }

    if (employeeResponse.response !== "accept") {
      return res.status(400).json({
        message: 'You can only mark tasks as complete if your response was "accept".',
      });
    }

    if (employeeResponse.status === "completed") {
      return res.status(400).json({ message: "This task is already marked as complete." });
    }

    employeeResponse.status = "completed";

    await task.save();

    // Update Employee Performance & Grade
    await updateUserPerformance(_id);

    res.status(200).json({
      message: "Task marked as complete successfully.",
      task,
    });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Validate taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    // Ensure user data is available
    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Fetching task:", { taskId, userId, userRole });

    // Base query
    let query = Task.findById(taskId)
      .populate("assignedEmployees", "name email") // Populate assigned employees
      .populate("createdBy", "name email"); // Populate creator

    // If the user is an employee, exclude employeeResponses
    if (userRole === "Employee") {
      query = query.select("-employeeResponses");
    }

    // Use `.lean()` for better performance if modifications are not needed
    const task = await query.lean();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user is the creator or an assigned employee
    const isCreator = task.createdBy?._id?.toString() === userId;
    const isAssigned = task.assignedEmployees.some(emp => emp._id.toString() === userId);

    if (!isCreator && !isAssigned) {
      return res.status(403).json({
        message: "Only assigned employees or the creator can view this task."
      });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { role, _id } = req.user; // Get user details

    // Ensure only employees can access this route
    if (role !== "Employee") {
      return res.status(403).json({ message: "Access denied. Only employees can view tasks by status." });
    }

    // Validate status input
    const validStatuses = ["pending", "failed", "completed"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status parameter." });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Fetch tasks where the employee is assigned and has the specified response status
    const tasks = await Task.find({
      "employeeResponses": {
        $elemMatch: { employee: new mongoose.Types.ObjectId(_id), status: status.toLowerCase() }
      }
    }).select("title description deadline totalNoOfAssignEmp");

    if (!tasks.length) {
      return res.status(404).json({ message: `No tasks found with status '${status}'.` });
    }

    res.status(200).json({ message: `Tasks with status '${status}' fetched successfully.`, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


