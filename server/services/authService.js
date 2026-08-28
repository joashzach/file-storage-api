const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError");

// SIGNING TOKEN FUNCTION
const signToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

// SIGN UP SERVICE
exports.signUpService = async (userData) => {
  // 1) Save user to the database
  const user = await User.create(userData);
  user.password = undefined;

  // 2) Sign a JWT
  const token = signToken(user._id);

  // 3) Return the user and the JWT
  return { user, token };
};

// LOGIN SERVICE
exports.loginService = async (userData) => {
  // 1) Check if email and password exists
  if (!userData.email || !userData.password) {
    throw new apiError("Please provide email and password!", 400);
  }

  // 2) Check if user entered both correctly
  const user = await User.findOne({ email: userData.email }).select(
    "+password",
  );

  if (
    !user ||
    !(await user.correctPassword(userData.password, user.password))
  ) {
    throw new apiError("Incorrect email or password!", 401);
  }

  // 3) Send the JWT back to the client
  const token = signToken(user._id);
  return token;
};


