import { LeaveRequest } from "../models/leaveRequest.model.js";
import { User } from "../models/user.model.js";
import {sendEmail} from "../utils/sendEmail.js";

// Employee: Submit Leave Request
export const submitLeaveRequest = async (req, res) => {
  try {
    const { leaveType, leaveDescription, startDate, endDate } = req.body;

    // Validation
    if (!leaveType || !leaveDescription || !startDate || !endDate) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const { name, email, role, linkedManagerKey } = req.user;
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);



    // Validation for startDate and endDate
    if (start < currentDate.setHours(0, 0, 0, 0)) {
        return res.status(400).json({
          success: false,
          message: "Start date must be today or a future date.",
        });
      }
  
      if (end < start) {
        return res.status(400).json({
          success: false,
          message: "End date must be the same or later than the start date.",
        });
      }


    // Only employees can submit leave requests
    if (role !== "Employee") {
      return res.status(403).json({ message: "Only employees can submit leave requests." });
    }


       // Find the linked manager
       const manager = await User.findOne({ managerKey: linkedManagerKey, role: "Manager" });

       if (!manager) {
         return res.status(404).json({
           success: false,
           message: "Manager not found for this employee.",
         });
       }
   

    const leaveRequest = new LeaveRequest({
      name,
      email,
      leaveType,
      leaveDescription,
      startDate,
      endDate,
      status: "pending",

    });

    await leaveRequest.save();

       // Email notification to the manager
    const managerEmailSubject = `Leave Request from ${name}`;
    const managerEmailMessage = `
      <h1>New Leave Request</h1>
      <p><strong>Employee Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Leave Type:</strong> ${leaveType}</p>
      <p><strong>Start Date:</strong> ${startDate}</p>
      <p><strong>End Date:</strong> ${endDate}</p>
      <p><strong>Description:</strong> ${leaveDescription}</p>
      <p>Please log in to the system to review and manage this request.</p>
    `;

    await sendEmail({
      email: manager.email,
      subject: managerEmailSubject,
      message: managerEmailMessage,
    });

    // Email confirmation to the employee
    const employeeEmailSubject = `Leave Request Submitted Successfully`;
    const employeeEmailMessage = `
      <h1>Leave Request Submitted</h1>
      <p>Dear ${name},</p>
      <p>Your leave request has been successfully submitted with the following details:</p>
      <p><strong>Leave Type:</strong> ${leaveType}</p>
      <p><strong>Start Date:</strong> ${startDate}</p>
      <p><strong>End Date:</strong> ${endDate}</p>
      <p><strong>Description:</strong> ${leaveDescription}</p>
      <p>Your manager will review your request and provide further updates.</p>
      <p>Thank you!</p>
    `;

    await sendEmail({
      email,
      subject: employeeEmailSubject,
      message: employeeEmailMessage,
    });


    res.status(201).json({
      message: "Leave request submitted successfully.",
      leaveRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager: Get Leave Requests
export const getLeaveRequests = async (req, res) => {
  try {
    const { role, managerKey, email } = req.user;

    if (role === "Manager") {
      // Get employees linked to the manager
      const employees = await User.find({ linkedManagerKey: managerKey }, "email");
      const employeeEmails = employees.map((employee) => employee.email);

      // Fetch leave requests for linked employees
      const leaveRequests = await LeaveRequest.find({ email: { $in: employeeEmails } });

      return res.status(200).json(leaveRequests);
    } else if (role === "Employee") {
      // Employee can only view their own leave requests
      const leaveRequests = await LeaveRequest.find({ email });
      return res.status(200).json(leaveRequests);
    } else {
      return res.status(403).json({ message: "Unauthorized access." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager: Update Leave Request Status
export const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;
    const { status } = req.body;

    if (req.user.role !== "Manager") {
      return res.status(403).json({ message: "Only managers can update leave requests." });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Use 'approved' or 'rejected'." });
    }

    const leaveRequest = await LeaveRequest.findById(leaveRequestId);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found." });
    }

    // Ensure the leave request belongs to an employee linked to the manager
    const employee = await User.findOne({
      email: leaveRequest.email,
      linkedManagerKey: req.user.managerKey,
    });

    if (!employee) {
      return res.status(403).json({ message: "You are not authorized to update this leave request." });
    }

    leaveRequest.status = status;
    leaveRequest.updatedAt = Date.now();

    await leaveRequest.save();

      // Send email to the employee about the updated leave request status
      const employeeEmailSubject = `Your Leave Request Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      const employeeEmailMessage = `
        <h1>Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
        <p>Dear ${employee.name},</p>
        <p>Your leave request has been ${status} by Manager ${req.user.name}.</p>
        <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
        <p><strong>Description:</strong> ${leaveRequest.leaveDescription}</p>
        <p>Thank you!</p>
      `;
  
      // Send the email notification to the employee
      await sendEmail({
        email: employee.email,
        subject: employeeEmailSubject,
        message: employeeEmailMessage,
      });

    res.status(200).json({
      message: `Leave request has been ${status}.`,
      leaveRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
