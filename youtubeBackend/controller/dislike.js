const Video = require("../model/video.js");

const createDislike = async (req, res) => {
  try {
    const { videoId } = req.params; //getting the video id from the url params
    const user = req.user; //getting the user from the cookie
    const video = await Video.findById(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    //remove like if it exists
    if (video.dislikedBy.includes(user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already disliked" });
    }

    //cheking if already liked
    if (video.likedBy.includes(user._id)) {
      video.likedBy = video.likedBy.filter(
        (like) => like.toString() !== user._id.toString()
      );
      video.likes -= 1;
    }

    //add dislike
    video.dislikedBy.push(user._id);
    video.dislikes += 1;
    await video.save();
    res
      .status(201)
      .json({ success: true, message: "Disliked successfully", video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const undoDislike = async (req, res) => {
  try {
    const { videoId } = req.params; //getting the video id from the url params
    const user = req.user; //getting the user from the cookie
    const video = await Video.findById(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    video.dislikedBy = video.dislikedBy.filter(
      (dislike) => dislike.toString() !== user._id.toString()
    ); //decrementing the dislikes
    video.dislikes -= 1; //decrementing the dislikes
    await video.save(); //saving the updated video
    res
      .status(200)
      .json({ success: true, message: "Undo dislike successfully", video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createDislike, undoDislike };
