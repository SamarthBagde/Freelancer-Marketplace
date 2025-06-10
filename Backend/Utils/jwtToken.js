import jwt from "jsonwebtoken";

export const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const options = {
    expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  user.password = undefined;
  res.status(statusCode).cookie("token", token, options).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};
