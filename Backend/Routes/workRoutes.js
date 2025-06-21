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
  searchWork,
  updateWorkDetails,
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
workRouter.post("/closeWork/:id", protect, restrictTo("client"), closeWork);
workRouter.get("/getWork/:id", protect, getWorkById);
workRouter.delete("/deleteWork/:id", protect, restrictTo("client"), deleteWork);
workRouter.patch(
  "/updateWork/:id",
  protect,
  restrictTo("client"),
  updateWorkDetails
);
workRouter.patch(
  "/updateWorkStatus/:id",
  protect,
  restrictTo("client"),
  updateWorkStatus
);

workRouter.get("/search", protect, searchWork);

export default workRouter;
