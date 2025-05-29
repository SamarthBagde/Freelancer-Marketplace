import { application } from "express";
import mongoose from "mongoose";

const workSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  deadline: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["open", "in progress", "completed", "cancelled"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  applications: [
    {
      freelancers: {
        type: String,
        require: true,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
});

const work = mongoose.model("work", workSchema);

export default work;
