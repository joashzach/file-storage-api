const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const User = require("../models/userModel");

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting JWT and checking if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new apiError("You are not logged in. Please log in to get access!", 401),
    );
  }

  // 2) Verification of JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists (in DB)
  const { id } = decoded;
  const user = await User.findById(id);
  if (!user) {
    return next(new apiError("This user no longer exists!", 401));
  }

  // 4) Check if the user changed password after JWT was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new apiError("User has changed the password. Please log in again!", 401),
    );
  }

  // GRANT ACCESS TO THE PROTECTED ROUTE
  req.user = user;
  next();
});

module.exports = protect;
