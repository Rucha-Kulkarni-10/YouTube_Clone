import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Save, MoreHorizontal, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Items/avatar";
import { Button } from "@/components/Items/button";
import { Separator } from "@/components/Items/separator";
import SuggestedVideo from '@/components/Video/SuggestedVideo';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CommentList from '@/components/Comment/CommentList';
import AddComment from '@/components/Comment/AddComment';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import getRelativeTimeString from '@/utilities/services/dateConverter';
import { formatViewCount } from '@/utilities/services/viewCountConverter';
import Loader from '@/components/Loader/Loader';


const VideoPage = () => {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const user = useSelector((state) => state.user.user);
  const isloggedin = useSelector((state) => state.user.isLoggedIn);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [channelData, setChannelData] = useState(null);
  const [likes, setLikes ] = useState(0);
  const [dislikes, setDisikes ] = useState(0);
  //fetch video data
  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/video/${videoId}`);
      setVideoData(response.data.video);
      setLikes(response.data.video.likes);
      setDisikes(response.data.video.dislikes)
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(channelData);

  //fetch suggested videos
  const fetchSuggestedVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/videos`);
      if (response.data.success) {
        setSuggestedVideos(response.data.videos);
      }
    } catch (error) {
      console.error('Error fetching suggested videos:', error);
    }
  };

  const fetchChannelData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/channelbyid/${videoData.channel._id}`);
      if (response.data.success) {
        setChannelData(response.data.channel);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error);
    }
  };

  useEffect(() => {
    fetchVideoData();
    fetchSuggestedVideos();
  }, [videoId]);

  useEffect(() => {
    if (videoData) {
      fetchChannelData();
    }
  }, [videoData, isSubscribed]);

  useEffect(() => {
    if (user && channelData) {
      setIsSubscribed(channelData.subscribedBy?.includes(user._id));
      setIsLiked(videoData.likedBy?.includes(user._id));
      setIsDisliked(videoData.dislikedBy?.includes(user._id));
    }
  }, [user, channelData]);

  //handle subscribe button
  const handleSubscribeClick = async () => {
    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (isSubscribed) {
        response = await axios.post(`http://localhost:3000/api/channel/unsubscribe/${channelData._id}`, {}, config);
      } else {
        response = await axios.post(`http://localhost:3000/api/channel/subscribe/${channelData._id}`, {}, config);
      }

      if (response.data.success) {
        setIsSubscribed(prev => !prev);
      }
    } catch (error) {
      console.error('Error subscribing to channel:', error);
    }
  };

  //handle like button
  const handleLikeClick = async () => {
    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      let response;
      if (isLiked) {
        response = await axios.post(`http://localhost:3000/api/video/unlike/${videoData._id}`, {}, config);
        if(response.data.success){
          setLikes(likes-1)
        }
       
      } else {
        response = await axios.post(`http://localhost:3000/api/video/like/${videoData._id}`, {}, config);
        if(response.data.success){
          setLikes(likes+1)
        }
        
      }
      if (response.data.success) {
        setIsLiked(prev => !prev);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  //handle dislike button
  const handleDislikeClick = async () => {
    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      let response;
      if (isDisliked) {
        response = await axios.post(`http://localhost:3000/api/video/undodislike/${videoData._id}`, {}, config);
      } else {
        response = await axios.post(`http://localhost:3000/api/video/dislike/${videoData._id}`, {}, config);
      }
      if (response.data.success) {
        setIsDisliked(prev => !prev);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };
  const increamentViews = async () => {
    try {
      const res = axios.get(`http://localhost:3000/api/video/view/${videoData._id}`);
      if (res.data.success) {
        console.log(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  //whenever this function is called, it will trigger a re-fetch of the comments
  function refreshComments() {
    setFetchTrigger(prev => !prev);
  }

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="bg-background text-foreground mt-5">
      <div className="max-w-[1280px] mx-auto px-4 py-6 lg:py-8 lg:flex lg:space-x-6">
        {/* Video Player and Info */}
        <div className="lg:w-2/3">
          {/* Video Player */}
          <div className="aspect-video bg-black mb-4">
            {videoData.assetUrl ? <ReactPlayer url={videoData.assetUrl} width="100%" height="100%" controls playing={true} stopOnUnmount={false} onStart={increamentViews} /> : <img
              src={videoData.thumbnailUrl}
              alt={videoData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/640x360?text=Video+Thumbnail";
              }}
            />}
          </div>

          {/* Video Title */}
          <h1 className="text-xl font-bold mb-2">{videoData.title}</h1>

          {/* Channel Info, Video Stats and Actions */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <Link to={`/channel/${channelData?.channelId}`}>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={videoData.channel.avatar} />
                  <AvatarFallback>{videoData?.channel?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{videoData.channel.name}</h3>
                  <p className="text-sm text-muted-foreground">{channelData?.subscribers} subscribers</p>
                </div>
              </div>
            </Link>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {isSubscribed ?
                <Button onClick={() => handleSubscribeClick()} variant="outline" className="bg-gray-800 text-white hover:text-white hover:bg-gray-700">Unsubscribe</Button> :
                <Button onClick={() => handleSubscribeClick()} >Subscribe</Button>
              }
              <Button variant="outline" size="sm" onClick={() => { handleLikeClick() }} className={`${isLiked ? 'text-blue-500 hover:text-blue-500' : ''}`}>
                <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'text-blue-500' : ''}`} /> {formatViewCount(likes)}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { handleDislikeClick() }} className={`${isDisliked ? 'text-blue-500 hover:text-blue-500' : ''}`}>
                <ThumbsDown className={`mr-2 h-4 w-4 ${isDisliked ? 'text-blue-500' : ''}`} /> {formatViewCount(dislikes)}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Video Description with Stats */}
          <div className="bg-secondary p-4 rounded-lg mb-6">
            <div className="text-muted-foreground text-sm mb-2">
              {videoData.views.toLocaleString()} views • {getRelativeTimeString(videoData.createdAt)}
            </div>
            <p>{videoData.description}</p>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold mb-4">{commentCount} Comments</h3>

            {/* New Comment Form */}
            {isloggedin && (
              <AddComment refresh={refreshComments} />
            )}

            {/* Existing Comments */}
            <CommentList refresh={refreshComments} setCommentCount={setCommentCount} />
          </div>
        </div>

        {/* Suggested Videos */}
        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <h2 className="font-semibold mb-4">Suggested Videos</h2>

          {suggestedVideos.map((i) => (
            <SuggestedVideo key={i._id} videoId={i._id} tittle={i.title} channel={i.channel.name} views={i.views} uploaded={i.createdAt} thumbnailUrl={i.thumbnailUrl} />

          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;