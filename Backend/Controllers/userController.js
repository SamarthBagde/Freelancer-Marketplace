import userModel from "../Models/userModel.js";

export const registerUser = async (req, res) => {
  console.log(req.body);
  const user = await userModel.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
};
