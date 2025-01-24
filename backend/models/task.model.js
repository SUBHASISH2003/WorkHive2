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
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  ],
  
  // Manager who created the task - reference to User model
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  
  // Employee responses for the task
  employeeResponses: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      response: {
        type: String,
        
        enum: ['accept', 'reject'],
      },
      status: {
        type: String,
        enum: ['pending', 'failed', 'completed'],
        default: 'pending',
      },
    },
  ],
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
});

taskSchema.pre('save', function (next) {
  if (this.deadline && this.deadline < new Date()) {
    this.employeeResponses.forEach((response) => {
      if (response.status === 'pending') {
        response.status = 'failed';
      }
    });
  }
  next();
});

// Export the Task model
export const Task = mongoose.model('Task', taskSchema);
