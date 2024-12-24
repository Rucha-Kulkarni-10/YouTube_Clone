function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = req.file.path; // The uploaded file URL from Cloudinary

    if (!fileUrl) {
      return res
        .status(500)
        .json({ success: false, message: "Unable to retrieve file URL" });
    }

    res
      .status(200)
      .json({ success: true, message: "Upload successful", fileUrl }); //sending success
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed", error });
  }
}

module.exports = {
  uploadAvatar
}