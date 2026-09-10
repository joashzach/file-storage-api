const express = require("express");
const protect = require("../middlewares/authMiddleware")
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadFile,
  getAllFiles,
  getFile,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getAllFiles);
router.route("/:id").get(protect, getFile).delete(protect, deleteFile);
router.get("/:id/download", protect, downloadFile);

module.exports = router;
