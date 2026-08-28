const catchAsync = require("../utils/catchAsync");
const apiError = require("../utils/apiError");
const { signUpService, loginService } = require("../services/authService");
const User = require("../models/userModel");

// SIGN UP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const { user, token } = await signUpService({
    name,
    email,
    password,
  });

  res.status(201).json({
    status: "success",
    user,
    token,
  });
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const token = await loginService({ email, password });

  res.status(200).json({
    status: "success",
    token,
  });
});


