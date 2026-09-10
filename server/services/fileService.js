const File = require("../models/fileModel");
const apiError = require("../utils/apiError");
const fs = require("fs");
const fsPromises = require("fs/promises");

exports.uploadFileService = async (fileData, id) => {
  const file = await File.create({
    originalName: fileData.originalname,
    storedName: fileData.filename,
    mimeType: fileData.mimetype,
    size: fileData.size,
    path: fileData.path,
    owner: id,
  });

  return file;
};

exports.getAllFilesService = async (id) => {
  const files = await File.find({ owner: id });
  if (files.length === 0) {
    throw new apiError("You do not have any files!", 404);
  }
  return files;
};

exports.getFileService = async (id, user) => {
  const file = await File.findOne({ _id: id, owner: user });
  if (!file) throw new apiError("This file does not exist!", 404);
  return file;
};


exports.downloadFileService = async (fileId, userId) => {
  const file = await File.findById(fileId);

  if (!file) {
    throw new apiError("This file does not exist!", 404);
  }

  if (file.owner.toString() !== userId.toString()) {
    throw new apiError(
      "You do not have permission to access this file!",
      403
    );
  }

  if (!fs.existsSync(file.path)) {
    throw new apiError("Physical file not found!", 404);
  }

  return file;
};

exports.deleteFileService = async (fileId, userId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new apiError("This file does not exist!", 404);
  }
  if (file.owner.toString() !== userId.toString()) {
    throw new apiError("You do not have permission to delete this file!", 403);
  }

  // Delete physical file from disk storage
  await fsPromises.unlink(file.path);

  // Delete metadata from DB
  await File.findByIdAndDelete(fileId);
};
