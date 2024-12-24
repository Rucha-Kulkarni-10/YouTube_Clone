const Video = require("../model/video.js");

const increamentViewCount = async (req, res) => {
  try {
    const { videoId } = req.params; //getting the video id from the url params
    const video = await Video.findById(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    video.views += 1; //incrementing the views
    await video.save(); //saving the updated video
    res.status(200).json({
      success: true,
      message: "View count incremented successfully",
      updatedViews: video.views,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    increamentViewCount
}