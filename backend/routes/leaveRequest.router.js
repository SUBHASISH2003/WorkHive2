import express from "express";
import {
  submitLeaveRequest,
  getLeaveRequests,
  getLeaveRequestsByStatus,
  updateLeaveRequestStatus,
} from "../controllers/leaveRequest.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Employee: Submit a leave request
router.post("/create", isAuthenticated, submitLeaveRequest);

// Manager & Employee: Get leave requests
router.get("/get", isAuthenticated, getLeaveRequests);

router.get("/status/:status", isAuthenticated, getLeaveRequestsByStatus);

// Manager: Update leave request status (approve/reject)
router.patch("/status/update/:leaveRequestId", isAuthenticated, updateLeaveRequestStatus);

export const leaveRoutes = router;
