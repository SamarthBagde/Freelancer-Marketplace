import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { AppError } from "../Utils/appError.js";
import sendEmail from "../Utils/email.js";
import crypto from "crypto";
import { sendToken } from "../Utils/jwtToken.js";

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

  //  Check if user changed password after the token was issued
  if (user.changePasswordAfer(decode.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
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

export const forgotPassword = asyncHandler(async (req, res, next) => {
  //1. get user based on email
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("User not found for this id", 404));
  }
  //2. generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3. send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\nIf you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});
export const resetPassword = asyncHandler(async (req, res, next) => {
  //1. get user based on token
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // to check token is expired or not, if token expired then there is no user
  });

  //2. if token is not expired and there is user set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  //3. update changedPaaswordAt property for the user

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //4. log the user in , send jwt token

  sendToken(user, 200, res);
});

//update password for this you need to be logged in
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  //1. get user
  // here req.user is avaliable but it dont have password file so we are not using it
  const user = await userModel.findById(req.user._id).select("+password");
  //2. check current password is correct
  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  //3. update password to new password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();

  //4. log in user and send token
  sendToken(user, 200, res);
});
