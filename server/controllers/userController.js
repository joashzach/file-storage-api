const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError");

// SIGNING TOKEN FUNCTION
const signToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//GET CURRENT AUTHENTICATED USER
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    user: currentUser,
  });
});

// UPDATE USER PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from the collection
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if the POSTed password is correct
  if (!(await user.correctPassword(currentPassword, user.password)))
    return next(
      new apiError("Your current password is wrong! Please try again!", 401),
    );

  // 3) If so, update the password
  user.password = newPassword;
  await user.save();

  // 4) Log the user in, and send the JWT
  const token = signToken(req.user.id);

  res.status(200).json({
    status: "success",
    message: "Password has been updated successfully!",
    token,
  });
});

// UPDATE USER
exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name && !email)
    return next(new apiError("Either provide name or email to update", 400));
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  res.status(200).json({
    status: "success",
    message: "User upated successfully!",
    user
  });
});

// DELETE USER
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully!",
  });
});
