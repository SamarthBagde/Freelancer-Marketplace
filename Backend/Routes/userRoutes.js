import express from "express";
import {
  registerUser,
  login,
  logout,
  updateProfile,
} from "../Controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.post("/update/:id", updateProfile);
userRouter.get("/logout", logout);

export default userRouter;
