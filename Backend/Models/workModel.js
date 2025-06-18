import mongoose from "mongoose";

const workSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
      freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
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
