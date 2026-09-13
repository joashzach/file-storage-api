const File = require("../models/fileModel");
const apiError = require("../utils/apiError");
const { uploadObject, getObject, deleteObject } = require("./storageService");

// UPLOAD FILE SERVICE
exports.uploadFileService = async (fileData, userId) => {
  const key = await uploadObject(fileData, userId);

  const file = await File.create({
    originalName: fileData.originalname,
    mimeType: fileData.mimetype,
    size: fileData.size,
    key: key,
    owner: userId,
  });

  return file;
};

// GET ALL FILES SERVICE
exports.getAllFilesService = async (id) => {
  const files = await File.find({ owner: id });
  if (files.length === 0) {
    throw new apiError("You do not have any files!", 200);
  }
  return files;
};

// GET A FILE SERVICE
exports.getFileService = async (id, user) => {
  const file = await File.findOne({ _id: id, owner: user });
  if (!file) throw new apiError("This file does not exist!", 404);
  return file;
};

// DOWNLOAD A FILE SERVICE
exports.downloadFileService = async (fileId, userId) => {
  const file = await File.findById(fileId);

  if (!file) {
    throw new apiError("This file does not exist!", 404);
  }

  if (file.owner.toString() !== userId.toString()) {
    throw new apiError("You do not have permission to access this file!", 403);
  }

  const fileStream = await getObject(file.key);

  return { file, fileStream };
};

// DELETE A FILE SERVICE
exports.deleteFileService = async (fileId, userId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new apiError("This file does not exist!", 404);
  }

  if (file.owner.toString() !== userId.toString()) {
    throw new apiError("You do not have permission to delete this file!", 403);
  }

  // Delete file from S3
  await deleteObject(file.key);

  // Delete metadata from DB
  await File.findByIdAndDelete(fileId);
};
