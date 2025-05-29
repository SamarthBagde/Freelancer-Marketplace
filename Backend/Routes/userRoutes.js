import express from "express";
import {
  registerUser,
  login,
  logout,
  updateProfile,
  getUsers,
  getUserById,
} from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.put("/update/:id", updateProfile);

userRouter.get("/getUsers", getUsers);
userRouter.get("/getUser/:id", getUserById);

export default userRouter;
