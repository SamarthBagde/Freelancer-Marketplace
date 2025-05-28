// import userModel from "../Models/userModel.js";
// import { asyncHandler } from "../Middlewares/asyncHandler.js";
// import { sendToken } from "../Utils/jwtToken.js";
// import { AppError } from "../Utils/appError.js";

// export const registerUser = asyncHandler(async (req, res, next) => {
//   const { name, email, password, phone, role, profile } = req.body;
//   const { domain, skills } = profile || {};

//   if (!name || !email || !password || !phone || !role) {
//     return next(
//       new AppError(
//         "All fields (name, email, password, phone, role) are required",
//         400
//       )
//     );
//   }

//   if (role === "freelancer") {
//     if (!domain || !Array.isArray(skills) || skills.length === 0) {
//       return next(
//         new AppError(
//           "Freelancer must provide a domain and at least one skill",
//           400
//         )
//       );
//     }
//   }

//   const userExists = await userModel.findOne({ email });
//   if (userExists) {
//     return next(new AppError("User already exists with this email", 400));
//   }

//   const user = {
//     name,
//     email,
//     password,
//     phone,
//     role,
//   };

//   if (role === "freelancer") {
//     user.profile = {
//       domain,
//       skills,
//     };
//   } else {
//     user.profile = undefined;
//   }

//   const userRes = await userModel.create(user);
//   sendToken(userRes, 201, res);
//   // res.status(201).json({
//   //   status: "success",
//   //   data: userRes,
//   // });
// });

// export const login = asyncHandler(async (req, res, next) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return next(new AppError("All fields are required", 400));
//   }

//   const user = await userModel.findOne({ email }).select("+password");

//   const isPassword = await user.comparePassword(password);
//   if (!user && !isPassword) {
//     return next(new AppError("Incorrect email or password", 401));
//   }

//   if (user.role !== role) {
//     return next(new AppError("User role mismatch", 401));
//   }

//   sendToken(user, 200, res);
// });
