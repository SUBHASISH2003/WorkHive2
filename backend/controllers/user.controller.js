import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import fs from "fs";
import { generateManagerKey } from "../utils/generateManagerKey.js";
import cloudinary from "../utils/cloudinary.js";


const deleteTempFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete temp file:", err);
  });
};


export const register = catchAsyncError(async (req, res, next) => {
  try {
    const {name, email, password, confirmPassword, role, managerKey, DateOfBirth, bio, profilePic, organizationName} = req.body;
    if (!name || !email || !password || !confirmPassword || !role || !DateOfBirth ) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ error: 'Passwords do not match.' });
    }

    if (!["Manager", "Employee"].includes(role)) {
      return next(new ErrorHandler("Invalid role provided.", 400));
    }
  


    const existingUser = await User.findOne({
      email,
      accountVerified: true,
    });

    if (existingUser) {
      return next(new ErrorHandler("Email is already used.", 400));
    }

    const registerationAttemptsByUser = await User.find({
      email,
      accountVerified: false 
      
    });

    if (registerationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler("Too many attempts. Try again later.", 429)
      );
    }

   // Role-specific logic
   let user;
   if (role === "Manager") {

    if (!organizationName) {
      return next(
        new ErrorHandler("Organization name is required for Managers.", 400)
      );
    }



    // Generate a unique manager key
    const newManagerKey = await generateManagerKey();

     user = await User.create({
      name,
      email,
      password,
      role,
      managerKey: newManagerKey,
      DateOfBirth,
      bio,
      profilePic,
      organizationName,
    });

    // sendToken(user, 201, "Manager registered successfully.", res);
  } else if (role === "Employee") {
    // Validate the provided manager key
    const manager = await User.findOne({ managerKey });
    if (!manager) {
      return next(new ErrorHandler("Invalid manager key.", 400));
    }

    // Create an employee user
    user = await User.create({
      name,
      email,
      password,
      role,
      linkedManagerKey: managerKey,
      DateOfBirth,
      bio,
      profilePic,
      organizationName: manager.organizationName,
    });

    // sendToken(user, 201, "Employee registered successfully.", res);
  } else {
    return next(new ErrorHandler("Invalid role. Must be 'Manager' or 'Employee'.", 400));
  }


    
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(
      verificationCode,
      name,
      email,
      res
    );
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(
  verificationCode,
  name,
  email,
  res
) {
  try {
    
    const message = generateEmailTemplate(name, verificationCode);
    sendEmail({ email, subject: "Your Verification Code", message });
    res.status(200).json({
    success: true,
    message: `Verification email successfully sent to ${name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}

function generateEmailTemplate(name, verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #71C9CE; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #71C9CE; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>DUTIO Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp} = req.body;


  try {
    const userAllEntries = await User.find({
     email,
     accountVerified: false,
        
      
    }).sort({ createdAt: -1 });

    if (!userAllEntries) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      await User.deleteMany({
        _id: { $ne: user._id },
        
          email, accountVerified: false 
        
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    const currentTime = Date.now();

    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();
    console.log(currentTime);
    console.log(verificationCodeExpire);
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account Verified.", res);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "User logged in successfully.", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required.", 400));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Generate OTP for password reset
  const resetPasswordOtp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  user.resetPasswordOtp = resetPasswordOtp;
  user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save({ validateBeforeSave: false });

  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #71C9CE; text-align: center;">Reset Password OTP</h2>
      <p style="font-size: 16px; color: #333;">Dear ${user.name || "User"},</p>
      <p style="font-size: 16px; color: #333;">We received a request to reset your password.</p>
      <p style="font-size: 16px; color: #333;">Your OTP for password reset is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #71C9CE; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${resetPasswordOtp}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">The OTP will expire in 10 minutes. Please use it to reset your password.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>DUTIO Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "DUTIO Reset Password OTP",
      message,
    });

    res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Failed to send OTP. Please try again.", 500));
  }
});

export const validateOtp = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP are required.", 400));
  }

  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpire: { $gt: Date.now() }, // Check if OTP is not expired
  });

  if (!user) {
    return next(new ErrorHandler("Invalid OTP or OTP has expired.", 400));
  }

  res.status(200).json({
    success: true,
    message: "OTP is valid.",
  });
});

export const setNewPassword = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and confirm password do not match.", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.password = password; // Save the new password
  user.resetPasswordOtp = undefined; // Clear the OTP
  user.resetPasswordOtpExpire = undefined; // Clear OTP expiration
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been updated successfully.",
  });
});

export const getRoomDetails = async (req, res) => {
  try {
    const { managerKey } = req.params;

    // Fetch the manager based on managerKey
    const manager = await User.findOne({ managerKey, role: "Manager" });

    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

    // Fetch all employees linked to this manager
    const employees = await User.find({ linkedManagerKey: managerKey, role: "Employee" });

    // Fetch employee performance for each employee
    const employeeData = await Promise.all(
      employees.map(async (employee) => {
        // Find tasks where the employee is assigned
        const tasks = await Task.find({ assignedEmployees: employee._id });

        // Calculate performance based on completed and failed tasks
        let completedTasks = 0;
        let failedTasks = 0;

        tasks.forEach((task) => {
          const response = task.employeeResponses.find(
            (resp) => resp.employee.toString() === employee._id.toString()
          );

          if (response) {
            if (response.status === "completed") completedTasks++;
            if (response.status === "failed") failedTasks++;
          }
        });

        // Calculate performance percentage
        const totalTasks = completedTasks + failedTasks;
        const performance = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
          name: employee.name,
          email: employee.email,
          performance: `${performance.toFixed(2)}%`,
        };
      })
    );

    // Structure the response to include manager info and employees with performance
    const response = {
      managerKey: manager.managerKey,
      manager: {
        name: manager.name,
        email: manager.email,
        
      },
      employees: employeeData,
    };

    return res.status(200).json({ message: "Manager and employees fetched successfully.", data: response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { bio } = req.body;

  // Ensure the user is logged in
  const userId = req.user._id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Handle profile picture upload if provided
  let profilePicUrl = user.profilePic;
  if (req.file) {
    try {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
        public_id: `${userId}-profile-pic`,
        overwrite: true,
        transformation: { width: 200, height: 200, crop: "fill" },
      });

      // Assign the uploaded image URL to user.profilePic
      profilePicUrl = result.secure_url;

      // Delete the temporary file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to upload profile picture.", 500));
    }
  }

  // Update the fields if provided
  if (bio) user.bio = bio;
  user.profilePic = profilePicUrl;

  // Save the updated user
  try {
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to save user profile.", 500));
  }
});
