import express from 'express';
import { createTask, getTasks, updateTask } from '../controllers/task.controller.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Create a new task (Manager only)
router.post('/create', isAuthenticated, createTask);

// Get tasks (Based on role: Manager sees all, Employee sees assigned tasks)
router.get('/get/task', isAuthenticated, getTasks);

// Update task status or employee response
router.patch('/status/:taskId', isAuthenticated, updateTask);

export default router;
