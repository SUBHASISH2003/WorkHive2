import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/user.router.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import taskRouter from "./routes/task.router.js";
import contactRoutes from "./routes/contactUs.router.js";
import { leaveRoutes } from "./routes/leaveRequest.router.js";

export const app = express();
config({path:".env"});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);

app.use("/api/task", taskRouter);

app.use("/api/contact", contactRoutes);

app.use("/api/leave", leaveRoutes);

removeUnverifiedAccounts();
connection();

app.use(errorMiddleware);