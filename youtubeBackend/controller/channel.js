const Channel = require("../model/channel.js");
const User = require("../model/user.js");

const createChannel = async (req, res) => {
  try {
    const { channelId, channelName, description, avatar, channelBanner } =
      req.body; //getting the channel details from the request body
    const owner = req.user._id; //getting the userid from the cookie
    //creating a new channel
    const newChannel = new channel({
      channelId,
      channelName,
      avatar,
      owner,
      description,
      channelBanner,
    });
    //saving the new channel
    const savedChannel = await newChannel.save();

    //updating the user's channels in the database
    if (savedChannel) {
      await User.findByIdAndUpdate(owner, {
        $push: {
          channels: {
            _id: savedChannel._id,
            handle: savedChannel.channelId,
            name: savedChannel.channelName,
            avatar: savedChannel.avatar,
          },
        },
      });
      res.status(201).json({
        success: true,
        message: "Channel created successfully",
        newChannel,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Channel creation failed",
      });
    }
  } catch (error) {
    //if channel already exists with the given id
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Sorry, this channel handle is already taken",
        error,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getChannel = async (req, res) => {
  try {
    const { handle } = req.params; //getting the channel id/handle from the url params
    const channel = await Channel.findOne({ channelId: handle }); //finding the channel
    //sending the channel
    if (channel) {
      res.status(200).json({ success: true, channel });
    } else {
      res.status(404).json({ success: false, message: "Channel not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getChannelById = async (req, res) => {
  try {
    const { id } = req.params; //getting the channel id from the url params
    const channel = await Channel.findById(id); //finding the channel
    res.status(200).json({ success: true, channel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getChannelByUser = async (req, res) => {
  try {
    const userId = req.user._id; //getting the user id from the cookie
    const channel = await Channel.findOne({ owner: userId }); //finding the channel
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }
    res.status(200).json({ success: true, channel });
  } catch (error) {
    console.log("error :\t", error)
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createChannel,
  getChannel,
  getChannelById,
  getChannelByUser,
};
