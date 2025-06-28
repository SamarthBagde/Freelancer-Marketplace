import userModel from "../Models/userModel.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import { sendToken } from "../Utils/jwtToken.js";
import { AppError } from "../Utils/appError.js";

//authentication and authorization routes
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone, role, profile } =
    req.body;
  const { domain, skills } = profile || {};

  if (!name || !email || !password || !confirmPassword || !phone || !role) {
    return next(
      new AppError(
        "All fields (name, email, password, confirmPassword, phone, role) are required",
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

  //you are checking here if use exist already but we can also do this using
  //duplicate key error in error habling because we marked email as unique
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  const user = {
    name,
    email,
    password,
    confirmPassword,
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

export const updateProfile = asyncHandler(async (req, res, next) => {
  //only allow to update name, phone, domain, skills
  const user = req.user;
  const { name, phone, domain, skills } = req.body;

  if (!user) {
    return next(new AppError("User not found for this id", 404));
  }

  if (
    !name &&
    !phone &&
    !domain &&
    (!Array.isArray(skills) || skills.length === 0)
  ) {
    return next(
      new AppError("Please provide at least one field to update", 400)
    );
  }

  const newData = {};

  if (name) newData.name = name;
  if (phone && phone.length === 10) newData.phone = phone;

  if (user.role === "freelancer") {
    if (domain || (Array.isArray(skills) && skills.length > 0)) {
      newData.profile = {};
      if (domain) {
        newData.profile.domain = domain;
      } else {
        newData.profile.domain = user.profile.domain;
      }

      if (skills && skills.length > 0) {
        newData.profile.skills = skills;
      } else {
        newData.profile.skills = user.profile.skills;
      }
    }
  }

  const updatedUser = await userModel.findByIdAndUpdate(user._id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    status: "success",
    total: users.length,
    data: {
      users,
    },
  });
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("No user found with the provided ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
