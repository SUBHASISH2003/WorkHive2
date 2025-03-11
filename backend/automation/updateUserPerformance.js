import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

// Function to update employee's task stats
export const updateUserPerformance = async (userId) => {
  try {
    // Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      console.error(`Invalid userId: ${userId}`);
      return;
    }

    // Fetch all tasks assigned to the employee
    const tasks = await Task.find({ assignedEmployees: userId });

    if (!tasks.length) {
      console.log(`No tasks found for user ${userId}`);
      return;
    }

    // Initialize counts
    let stats = {
      totalNoOfAssignTask: tasks.length,
      totalCompletedTasks: 0,
      totalAcceptedTasks: 0,
      totalRejectedTasks: 0,
      totalPendingTasks: 0,
      totalFailedTasks: 0,
    };

    // Process tasks efficiently
    tasks.forEach((task) => {
      const response = task.employeeResponses.find(
        (resp) => resp.employee.toString() === userId.toString()
      );

      if (response) {
        if (response.response === "accept") stats.totalAcceptedTasks++;
        if (response.response === "reject") stats.totalRejectedTasks++;

        if (response.status === "completed") stats.totalCompletedTasks++;
        if (response.status === "failed") stats.totalFailedTasks++;
        if (response.status === "pending") stats.totalPendingTasks++;
      }
    });

    // Calculate performance percentage
    const performance =
      stats.totalNoOfAssignTask > 0
        ? (stats.totalCompletedTasks / stats.totalNoOfAssignTask) * 100
        : 0;

    // Assign grade based on performance
    let grade = "Bad";
    if (performance >= 80) grade = "Excellent";
    else if (performance >= 60) grade = "Good";
    else if (performance >= 30) grade = "Average";

    // Round performance to 2 decimal places
    const performanceFixed = performance.toFixed(2);

    // Fetch user document
    const user = await User.findById(userId);

    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    // Update fields only if values have changed
    let isUpdated = false;

    for (let key in stats) {
      if (user[key] !== stats[key]) {
        user[key] = stats[key];
        isUpdated = true;
      }
    }

    if (user.performance !== performanceFixed) {
      user.performance = performanceFixed;
      isUpdated = true;
    }

    if (user.grade !== grade) {
      user.grade = grade;
      isUpdated = true;
    }

    if (isUpdated) {
      await user.save();
      console.log(
        `✅ Updated performance for user ${userId}: ${performanceFixed}% - ${grade}`
      );
    } else {
      console.log(`⚠️ No changes in performance for user ${userId}`);
    }
  } catch (error) {
    console.error("❌ Error updating user performance:", error);
  }
};
