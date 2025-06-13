import userModel from "../Models/userModel.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { AppError } from "../Utils/appError.js";
import jwt from "jsonwebtoken";

export const protect = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new AppError("You are not logged in please log in to get access", 401)
    );
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(decode.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  req.user = user;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission for this", 403));
    }
    next();
  };
};

export const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new AppError("Authentication failed", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    return res.status(200).json({
      status: "success",
      authenticated: true,
      user: user,
      userRole: user.role,
    });
  } catch (error) {
    return res.status(401).json({ status: "fail", authenticated: false });
  }
});
