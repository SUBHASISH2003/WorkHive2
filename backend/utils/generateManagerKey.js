import { User } from "../models/user.model.js";

// Function to generate a unique 5-digit managerKey
export const generateManagerKey = async () => {
  let key;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 5-digit number
    key = Math.floor(10000 + Math.random() * 90000).toString();

    // Check if the key already exists in the database
    const existingUser = await User.findOne({ managerKey: key });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return key;
};
