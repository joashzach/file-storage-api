const express = require("express");

const { getCurrentUser, updatePassword, deleteMe, updateMe } = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.post("/updatePassword", protect, updatePassword);
router.delete("/deleteMe", protect, deleteMe);
router.patch("/updateMe", protect, updateMe);

module.exports = router;
