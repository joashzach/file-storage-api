const File = require("../models/fileModel");
const ApiError = require("../utils/apiError");
const {
  generateUploadUrl,
  generateDownloadUrl,
  deleteObject,
} = require("./storageService");

// GENERATE UPLOAD URL SERVICE
exports.generateUploadUrlService = async (fileData, userId) => {
  const key = `users/${userId}/${Date.now()}-${fileData.originalName}`;

  const uploadUrl = await generateUploadUrl(key, fileData.mimeType);

  return {key, uploadUrl};
};

// CONFIRM UPLOAD SERVICE 
exports.confirmUploadService = async (fileData, userId) => {
  const file = await File.create({
    originalName: fileData.originalName,
    mimeType: fileData.mimeType,
    size: fileData.size,
    key: fileData.key,
    owner: userId,
  })

  return file;
}

// GENERATE DOWNLOAD URL SERVICE
exports.generateDownloadUrlService = async (fileId, userId) => {
  const file = await File.findById(fileId);

  if(!file) {
    throw new ApiError("This file does not exist!", 404)
  }

  if(file.owner.toString() !== userId.toString()) {
    throw new ApiError("You do not have permission to access this file!", 403);
  }

  const downloadUrl = await generateDownloadUrl(file.key);

  return downloadUrl;
}

// GET ALL FILES SERVICE
exports.getAllFilesService = async (id) => {
  const files = await File.find({ owner: id });
  
  return files;
};

// GET A FILE SERVICE
exports.getFileService = async (id, user) => {
  const file = await File.findOne({ _id: id, owner: user });
  if (!file) throw new ApiError("This file does not exist!", 404);
  return file;
};

// DELETE A FILE SERVICE
exports.deleteFileService = async (fileId, userId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new ApiError("This file does not exist!", 404);
  }

  if (file.owner.toString() !== userId.toString()) {
    throw new ApiError("You do not have permission to delete this file!", 403);
  }

  // Delete file from S3
  await deleteObject(file.key);

  // Delete metadata from DB
  await File.findByIdAndDelete(fileId);
};
