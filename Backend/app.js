import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/userRoutes.js";
import workRouter from "./Routes/workRoutes.js";
import { AppError } from "./Utils/appError.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import cors from "cors";

const app = express();

//automatically parse incoming JSON data in the body of HTTP requests
//Without express.json(), Express won’t understand this req.body — it'll be undefined
app.use(express.json());

//enables cookie parsing in Express. It reads cookies from the incoming Request and adds them to req.cookies
app.use(cookieParser());

//allow requests only from the given frontend URL
const corsOriginURL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: corsOriginURL,
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

//global error handler middleware
app.use(errorHandler);

export default app;
