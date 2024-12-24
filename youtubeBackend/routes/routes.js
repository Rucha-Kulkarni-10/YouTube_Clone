const { Router } = require("express");
const { signup, signin, getUser, signout } = require("../controller/user.js");
const {
  createChannel,
  getChannel,
  getChannelByUser,
  getChannelById,
} = require("../controller/channel.js");
const { tokenAuthenticator } = require("../middleware/tokenAuthenticator.js");
const {
  getVideos,
  getVideoById,
  uploadVideo,
  getVideosByChannel,
  deleteVideo,
  editVideo,
} = require("../controller/video.js");
const {
  createComment,
  deleteComment,
  editComment,
  getComments,
} = require("../controller/comment.js");
const { createLike, undoLike } = require("../controller/like.js");
const { createDislike, undoDislike } = require("../controller/dislike.js");
const {
  createSubscription,
  undoSubscription,
} = require("../controller/subscription.js");
const {upload} = require("../config/multerConfig.js");
const { uploadAvatar } = require("../controller/uploadAvatar.js");
const { uploadBanner } = require("../controller/uploadBanner.js");
const { increamentViewCount } = require("../controller/increamentViewCount.js");

const router = Router();

//user routes
router.post("/user/signup", signup); //signup
router.post("/user/signin", signin); //login
router.get("/user", tokenAuthenticator, getUser); //get updated data of logged in user
router.post("/user/logout", signout);

//channel routes
router.post(
  "/channel/create",
  tokenAuthenticator,
  upload.single("avatar"),
  createChannel
); //create channel
router.get("/channel/:handle", getChannel); //get channel by handle
router.get("/channel", tokenAuthenticator, getChannelByUser); //get channel of signed in user
router.get("/channelbyid/:id", getChannelById); //get channel by id

//video routes
router.post("/video/upload", tokenAuthenticator, uploadVideo); //upload video
router.get("/video/:videoId", getVideoById); //get video
router.get("/videos", getVideos); //get all videos
router.get("/videos/channel/:channelId", getVideosByChannel); //get video by channel id
router.delete("/video/delete/:videoId", tokenAuthenticator, deleteVideo); //remove video
router.put("/video/edit/:videoId", tokenAuthenticator, editVideo); //edit video

//comment routes
router.post("/comment/create/:videoId", tokenAuthenticator, createComment); //create comment
router.delete("/comment/delete/:commentId", tokenAuthenticator, deleteComment); //remove comment
router.put("/comment/edit/:videoId", tokenAuthenticator, editComment); //edit comment
router.get("/comments/:videoId", getComments); //get all comments of a video

//like routes
router.post("/video/like/:videoId", tokenAuthenticator, createLike); //create like
router.post("/video/unlike/:videoId", tokenAuthenticator, undoLike); //remove like
router.post("/video/dislike/:videoId", tokenAuthenticator, createDislike); //create dislike
router.post("/video/undodislike/:videoId", tokenAuthenticator, undoDislike); //remove dislike

//subscription routes
router.post(
  "/channel/subscribe/:channelId",
  tokenAuthenticator,
  createSubscription
); //create subscription
router.post(
  "/channel/unsubscribe/:channelId",
  tokenAuthenticator,
  undoSubscription
); //remove subscription

//upload image
router.post("/upload/avatar", upload.single("avatar"), uploadAvatar); //upload avatar to cloudinary
router.post(
  "/upload/banner/:channelId",
  tokenAuthenticator,
  upload.single("banner"),
  uploadBanner
); //upload banner to cloudinary

//increase view count
router.get("/video/view/:videoId", increamentViewCount); //increase view count

module.exports = router;
