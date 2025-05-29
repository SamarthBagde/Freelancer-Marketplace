import userModel from "../Models/userModel.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { sendToken } from "../Utils/jwtToken.js";
import { AppError } from "../Utils/appError.js";
import jwt from "jsonwebtoken";

//authentication and authorization routes
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, role, profile } = req.body;
  const { domain, skills } = profile || {};

  if (!name || !email || !password || !phone || !role) {
    return next(
      new AppError(
        "All fields (name, email, password, phone, role) are required",
        400
      )
    );
  }

  if (role === "freelancer") {
    if (!domain || !Array.isArray(skills) || skills.length === 0) {
      return next(
        new AppError(
          "Freelancer must provide a domain and at least one skill",
          400
        )
      );
    }
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  const user = {
    name,
    email,
    password,
    phone,
    role,
  };

  if (role === "freelancer") {
    user.profile = {
      domain,
      skills,
    };
  } else {
    user.profile = undefined;
  }

  const userRes = await userModel.create(user);
  sendToken(userRes, 201, res);
  // res.status(201).json({
  //   status: "success",
  //   data: userRes,
  // });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new AppError("All fields are required", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.role !== role) {
    return next(new AppError("User role mismatch", 401));
  }

  sendToken(user, 200, res);
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expire: new Date(),
    })
    .json({
      status: "success",
      message: "Logged out successfully",
    });
});

//it is just demo need to work on it
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found for this id", 404));
  }
  const { name, phone } = req.body;

  if (!name && !phone) {
    return next(new AppError("Please enter data correctly", 400));
  }

  const newData = {
    name,
    phone,
  };

  const updatedUser = await userModel.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
}); // not done yet

// export const protect = asyncHandler(async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return next(
//       new AppError("You are not logged in please log in to get access", 401)
//     );
//   }

//   const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   const user = await userModel.findById(decode.id);

//   if (!user) {
//     return next(
//       new AppError("The user belonging to this token does no longer exist", 401)
//     );
//   }

//   req.user = user;

//   next();
// });

// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(new AppError("You do not have permission for this", 403));
//     }
//     next();
//   };
// };

//user action routes

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("No user found", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
