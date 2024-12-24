const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig.js");

// Multer middleware
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "channelAvatars", // Folder where images will be stored on Cloudinary
    allowed_formats: ["jpeg", "png", "jpg", "webp", "gif"], // Allowed file formats
  },
});

const upload = multer({ storage });

module.exports = {upload};
