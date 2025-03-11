import express from 'express';
import { createTask, getTasks, updateTask, markTaskAsComplete, getTaskDetails, getTasksByStatus} from '../controllers/task.controller.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Create a new task (Manager only)
router.post('/create', isAuthenticated, createTask);

// Get tasks (Based on role: Manager sees all, Employee sees assigned tasks)
router.get('/get', isAuthenticated, getTasks);

// Update task status or employee response
router.patch('/response/:taskId', isAuthenticated, updateTask);


router.patch('/status/:taskId', isAuthenticated, markTaskAsComplete);

router.get("/:taskId", isAuthenticated, getTaskDetails);

// Get tasks by status (pending, failed, completed)
router.get("/:status", isAuthenticated, getTasksByStatus);



export default router;
