import express from 'express';
import { submitContact } from '../controllers/contactUs.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Route to submit a contact inquiry
router.post('/contact',isAuthenticated, submitContact);

export default router;
