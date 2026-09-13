const s3 = require("../config/s3");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// UPLOAD OBJECT
exports.uploadObject = async (fileData, userId) => {
  const key = `users/${userId}/${Date.now()}-${fileData.originalname}`;
  console.log(key);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileData.buffer,
    ContentType: fileData.mimetype,
  });

  await s3.send(command);
  return key;
};

// GET OBJECT
exports.getObject = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const response = await s3.send(command);

  return response.Body;
};

// DELETE OBJECT
exports.deleteObject = async (key) => {
const command = new DeleteObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: key,
})
await s3.send(command);
};

