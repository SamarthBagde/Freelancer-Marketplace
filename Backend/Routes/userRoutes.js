import express from "express";
import {
  registerUser,
  login,
  logout,
  updateProfile,
  getUsers,
  getUserById,
} from "../Controllers/userController.js";
import { authUser, protect } from "../Controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/auth/check", authUser);
userRouter.get("/getUsers", getUsers);
userRouter.get("/getUser/:id", getUserById);
userRouter.put("/update/:id", protect, updateProfile);

export default userRouter;
