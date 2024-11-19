import Header from '../components/Header';
import Footer from "../components/Footer";
import './videoPlayer.scss';
import axios from 'axios';
import Liked from '../assets/markcomplete.jpg';
import Unliked from '../assets/complete.jpg';
import Disliked from '../assets/marknotcomplete.jpg';
import Undisliked from '../assets/notcomplete.jpg';
import { useEffect, useState } from 'react';


const VideoPlayer = () => {
  const videoUrl = 'http://localhost:3000/video/video?id=' + localStorage.getItem('video_id');
  console.log(videoUrl);

  const [videoData, setVideoData] = useState({});
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:3000/video/videoData', {method: "POST",body: {video_id: localStorage.getItem('video_id')}}, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
      .then((response) => {
        console.log(response);
        setVideoData(response.data.data)
        setLikes(response.data.data.likes)
        setDislikes(response.data.data.dislikes)
        
        if(response.data.data.isLiked) setIsLiked(true);
        if(response.data.data.isDisliked) setIsDisliked(true);
      })
      .catch((error) => console.error('Error fetching video data: ', error));
  }, []);

  async function handleLike() {
    const payload = {video_id: localStorage.getItem('video_id')};

    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
      payload['isLike'] = -1;
    }
    else {
      setIsLiked(true);
      setLikes(likes + 1);
      payload['isLike'] = 1;

      if (isDisliked) {
        setIsDisliked(false);
        setDislikes(dislikes - 1);
        payload['isDislike'] = -1;
      }
    }

    const response = await axios.post("http://localhost:3000/video/likeDislike", {payload}, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });
  }

  async function handleDislike() {
    const payload = {video_id: localStorage.getItem('video_id')};

    if (isDisliked) {
      setIsDisliked(false);
      setDislikes(dislikes - 1);
      payload['isDislike'] = -1;
    }
    else {
      setIsDisliked(true);
      setDislikes(dislikes + 1);
      payload['isDislike'] = 1;

      if (isLiked) {
        setIsLiked(false);
        setLikes(likes - 1);
        payload['isLike'] = -1;
      }
    }

    const response = await axios.post("http://localhost:3000/video/likeDislike", {payload}, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });
  }

  return <>
    <Header />

    <section className="video-conatiner">
      <video controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    </section>

    <section className="video-desc px-6 py-3 mb-4">
      <h3 className='text-capitalize'>{videoData.title}</h3>
      <div className='like-dislike'>
        <img src={isLiked ? Liked : Unliked} alt='' onClick={handleLike} /> <span>{likes}</span>
        <img src={isDisliked ? Disliked : Undisliked} alt='' onClick={handleDislike} /> <span>{dislikes}</span>
      </div>

      <p className='text-capitalize  mb-2'>{videoData.description}.</p>


      <p className=''>Uploader: {videoData.name} ({videoData.email})</p>
    </section>
    <Footer/>
  </>
}

export default VideoPlayer;
