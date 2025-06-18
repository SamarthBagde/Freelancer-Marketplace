import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import work from "./workModel.js";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain atlest 3 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },

  password: {
    type: String,
    required: true,
    minLength: [8, "Password should contain minimun 8 characters"],
    select: false,
  },

  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "freelancer"],
    required: true,
  },
  profile: {
    domain: String,
    skills: [String],
  },

  workHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "work",
    },
  ],

  currentWork: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "work",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 5);
});

userSchema.methods.comparePassword = async function (enteredPass) {
  return await bcryptjs.compare(enteredPass, this.password);
};

const user = mongoose.model("user", userSchema);

export default user;
