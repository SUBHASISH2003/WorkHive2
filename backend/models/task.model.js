import mongoose from 'mongoose';
import { User } from "../models/user.model.js";

// Define the task schema
const taskSchema = new mongoose.Schema({
  // Task title - required and trimmed
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  
  // Task description - required
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  
  // Task deadline - required date field
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline'],
  },
  
  // Assigned employees - array of references to User model
  assignedEmployees: [
    {
      type: String,
      required: true,
    },
  ],
  
  // Task status - enum with specific allowed values
  status: {
    type: String,
    enum: ['pending', 'failed', 'completed'],
    default: 'pending',
  },
  
  // Manager who created the task - reference to User model
  createdBy: {
    type: String,
    required: true,
  },
  
  // Employee responses for the task
  employeeResponses: [
    {
      employee: {
        type: String,
        required: true,
      },
      response: {
        type: String,
        enum: ['approved', 'rejected'],
      },
    },
  ],
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
});

// Middleware to auto-update status to 'failed' if deadline is passed
taskSchema.pre('save', function(next) {
  if (this.deadline < new Date() && this.status === 'pending') {
    this.status = 'failed';
  }
  next();
});

// Export the Task model
export const Task = mongoose.model('Task', taskSchema);
