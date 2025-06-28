import express from "express";
import {
  registerUser,
  login,
  logout,
  updateProfile,
  getUsers,
  getUserById,
} from "../Controllers/userController.js";
import {
  authUser,
  forgotPassword,
  protect,
  resetPassword,
  updatePassword,
} from "../Controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/auth/check", authUser);
userRouter.get("/getUsers", getUsers);
userRouter.get("/getUser/:id", getUserById);
userRouter.patch("/updateProfile", protect, updateProfile);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.patch("/updatePassword", protect, updatePassword);

export default userRouter;
