const Video = require("../model/video.js");
const Channel = require("../model/channel.js");

const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params; // Get the video ID from the request parameters
    const video = await Video.findById(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" }); //if the video is not found sending 404
    }
    res.status(200).json({ success: true, video }); //sending the video
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, category } = req.body; //getting the video details from the request body
    const { user } = req; //getting the user from the cookie
    const { videoId } = req.params;
    const video = await Video.findById(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" }); //if the video is not found sending 404
    }
    //updating the video
    video.title = title;
    video.description = description;
    video.thumbnailUrl = thumbnailUrl;
    video.category = category;

    await video.save(); //saving the updated video
    res
      .status(200)
      .json({ success: true, message: "Video updated successfully", video }); //sending the updated video
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params; //getting the video id from the url params
    const video = await Video.findByIdAndDelete(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" }); //if the video is not found sending 404
    }
    res
      .status(200)
      .json({ success: true, message: "Video deleted successfully" }); //sending success
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, assetUrl, category } = req.body; //getting the video details from the request body
    const { user } = req; //getting the user from the cookie
    let channel = user.channels[0];
    if (!channel) {
      channel = await Channel.findOne({ owner: user._id }); //incase the channel is not in the cookie getting the channel from the database
    }
    //creating a new video
    const video = new Video({
      title,
      description,
      thumbnailUrl,
      assetUrl,
      category,
      channel: {
        _id: channel._id,
        name: channel.name ? channel.name : channel.channelName,
        avatar: channel.avatar,
      },
    });

    await video.save();
    res.status(201).json({
      message: "Video uploaded successfully",
      success: true,
      video,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to upload video",
      error: error.message,
    });
  }
};

const getVideosByChannel = async (req, res) => {
  try {
    const { channelId } = req.params; //getting the channel id from the url params
    const videos = await Video.find({ "channel._id": channelId }); //finding all videos with the channel id
    if (videos.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No videos found" }); //if no videos are found, returning a 404
    }
    res.status(200).json({ success: true, videos: videos }); //sending all the videos
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({}); // find all videos
    if (videos.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No videos found" });
    }
    res.status(200).json({ success: true, videos }); // sending all the videos
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVideoById,
  editVideo,
  deleteVideo,
  uploadVideo,
  getVideos,
  getVideosByChannel,
};
