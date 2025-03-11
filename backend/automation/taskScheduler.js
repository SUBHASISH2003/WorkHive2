import { Task } from "../models/task.model.js";

// Function to update expired tasks
const updateExpiredTasks = async () => {
  try {
    const now = new Date();

    // Find all tasks where the deadline has passed
    const expiredTasks = await Task.find({ deadline: { $lt: now } });

    if (expiredTasks.length === 0) {
      return;
    }

    for (const task of expiredTasks) {
      let hasChanges = false; // Track if updates are needed

      // Loop through assigned employees and check if they have a response
      task.assignedEmployees.forEach((employeeId) => {
        const responseIndex = task.employeeResponses.findIndex(
          (response) => response.employee.toString() === employeeId.toString()
        );

        // If the employee has no response, add it with "reject" and "failed"
        if (responseIndex === -1) {
          task.employeeResponses.push({
            employee: employeeId,
            response: "reject",
            status: "failed",
          });
          hasChanges = true;
        }
      });

      // If there were any changes, mark `employeeResponses` as modified
      if (hasChanges) {
        task.markModified("employeeResponses"); // Ensure Mongoose detects changes
        await task.save(); // Save the changes
      }
    }
  } catch (error) {
    console.error("Error updating expired tasks:", error);
  }
};

// Run this function every hour
setInterval(updateExpiredTasks, 60 * 60 * 1000); // Runs every 1 hour

export default updateExpiredTasks;
