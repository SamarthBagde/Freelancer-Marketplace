import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/userRoutes.js";
import workRouter from "./Routes/workRoutes.js";
import { AppError } from "./Utils/appError.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

// 150 requerst pre 1 hr allowed for one ip
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

//automatically parse incoming JSON data in the body of HTTP requests
//Without express.json(), Express won’t understand this req.body — it'll be undefined
app.use(express.json());

// to avoide NoSQL query injection
// but not working
// app.use(mongoSanitize({}));

//data sanitization against xss
// app.use(xss());

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
