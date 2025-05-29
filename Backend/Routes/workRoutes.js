import express from "express";
import {
  acceptApplycation,
  addWork,
  applyForWork,
  closeWork,
  deleteWork,
  getWorkById,
  getWorks,
  updateWorkStatus,
} from "../Controllers/workController.js";
import { protect, restrictTo } from "../Controllers/authController.js";

const workRouter = express.Router();

workRouter.post("/addwork", protect, restrictTo("client"), addWork);
workRouter.get("/getWorks", protect, getWorks);
workRouter.post("/:id/apply", protect, restrictTo("freelancer"), applyForWork);
workRouter.post(
  "/:id/accept",
  protect,
  restrictTo("client"),
  acceptApplycation
);
workRouter.post("/:id/closeWork", protect, restrictTo("client"), closeWork);
workRouter.get("/getWork/:id", protect, getWorkById);
workRouter.delete("/deleteWork/:id", protect, restrictTo("client"), deleteWork);
workRouter.patch(
  "/updateWorkStatus/:id",
  protect,
  restrictTo("client"),
  updateWorkStatus
);

export default workRouter;
