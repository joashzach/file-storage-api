const healthController = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Server is running successfully",
  });
};

module.exports = healthController;
