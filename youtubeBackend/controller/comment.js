const Comment = require("../model/comment.js");
const Video = require("../model/video.js");

const createComment = async (req, res) => {
  try {
    const { videoId } = req.params; //getting the video id from the url params
    const user = req.user; //getting the user from the cookie
    const { text } = req.body; //getting the text from the request body
    const video = await Video.findById(videoId); //searching the video in the database
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    console.log("videoId:", videoId);
    //create new comment
    const newComment = new Comment({
      text,
      video: videoId,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    });
    console.log(newComment);
    await newComment.save(); //saving the new comment
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      newComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params; //getting the comment id from the url params
    const comment = await Comment.findById(commentId); //finding the comment
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    await comment.deleteOne(); //deleting the comment
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editComment = async (req, res) => {
  try {
    const { text, commentId } = req.body; //getting the text from the request body
    const comment = await Comment.findById(commentId); //finding the comment
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    comment.text = text; //updating the comment text
    await comment.save(); //saving the updated comment
    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComments = async (req, res) => {
  const { videoId } = req.params; //getting the video id from the url params
  try {
    const comments = await Comment.find({ video: videoId }); //searching the comments in the database
    // if no comments found
    if (comments.length === 0) {
      return res.status(404).json({ error: "No comments found" });
    }

    // sending the comments
    res.status(200).json({ success: true, comments: comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createComment, deleteComment, editComment, getComments };
