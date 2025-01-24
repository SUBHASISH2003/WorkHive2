import express from 'express';
import { createTask, getTasks, updateTask, markTaskAsComplete } from '../controllers/task.controller.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Create a new task (Manager only)
router.post('/task/create', isAuthenticated, createTask);

// Get tasks (Based on role: Manager sees all, Employee sees assigned tasks)
router.get('/task/get', isAuthenticated, getTasks);

// Update task status or employee response
router.patch('/task/response/:taskId', isAuthenticated, updateTask);


router.patch('/task/status/:taskId', isAuthenticated, markTaskAsComplete);


export default router;
