import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
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

  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
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

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 12);
  this.confirmPassword = undefined; // delete confirm password
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; //keep some buffer because it take time to update in db
  next();
});

userSchema.methods.comparePassword = async function (enteredPass) {
  return await bcryptjs.compare(enteredPass, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min
  return resetToken;
};

userSchema.methods.changePasswordAfer = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; // token is issued before the password change
  }
  return false; // password is not changed yet
};

const user = mongoose.model("user", userSchema);

export default user;
