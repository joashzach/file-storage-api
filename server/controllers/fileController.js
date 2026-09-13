const catchAsync = require("../utils/catchAsync");
const {
  uploadFileService,
  getAllFilesService,
  getFileService,
  downloadFileService,
  deleteFileService,
} = require("../services/fileService");

// For storing File Metadata in DB
exports.uploadFile = catchAsync(async (req, res) => {
  const file = await uploadFileService(req.file, req.user._id);

  res.status(201).json({
    message: "File uploaded successfully!",
    data: {
      file,
    },
  });
});

exports.getAllFiles = catchAsync(async (req, res, next) => {
  const files = await getAllFilesService(req.user._id);
  res.status(200).json({
    message: "Received all files successfully!",
    data: {
      results: files.length,
      files,
    },
  });
});

exports.getFile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  const file = await getFileService(id, user);

  res.status(200).json({
    message: "Received file successfully!",
    file,
  });
});

exports.downloadFile = catchAsync(async (req, res, next) => {
  const { file, fileStream } = await downloadFileService(
    req.params.id,
    req.user._id,
  );

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.originalName}"`,
  );

  fileStream.pipe(res);
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  await deleteFileService(req.params.id, req.user._id);
  res.status(200).json({
    message: "File deleted successfully!",
  });
});
