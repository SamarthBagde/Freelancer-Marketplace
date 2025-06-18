import { AppError } from "../Utils/appError.js";

const sendError = (err, res) => {
  //sending error msg only if error is operational i.e related to user input
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error : ", err);
    //sending generic error if it is not operational error
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);

  const message = `Invalid input data. ${errors.join(", ")}`;
  return new AppError(message, 400);
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = err;

  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  }
  sendError(error, res);
};
