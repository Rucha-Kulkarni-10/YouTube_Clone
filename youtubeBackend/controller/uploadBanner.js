const Channel = require("../model/channel.js");

const uploadBanner = async (req, res) => {
  try {
    const { channelId } = req.params; //getting the channel id from the url params
    const bannerURl = req.file.path; //getting the url from multer middleware
    const channel = await Channel.findById(channelId); //finding the channel
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" }); //if the channel is not found sending 404
    }
    channel.channelBanner = bannerURl; //updating the channel banner
    await channel.save(); //saving the channel
    res.status(200).json({
      success: true,
      message: "Banner uploaded successfully",
      channelBanner: bannerURl,
    }); //sending success
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    uploadBanner
}