import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/userRoutes.js";
import workRouter from "./Routes/workRoutes.js";
import { AppError } from "./Utils/appError.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/work", workRouter);

app.all("*unknown", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `Can't find ${req.originalUrl} on this server!`,
  //   });
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
