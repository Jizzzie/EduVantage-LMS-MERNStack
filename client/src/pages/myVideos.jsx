import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import Footer from "../components/Footer";

const MyVideos = () => {
  const [isChange, setIsChange] = useState(false);
  const [videos, setVideos] = useState([]);

  async function getMyVideos() {
    const data = await axios.post("http://localhost:3000/video/myvideos", { email: localStorage.getItem('email') }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}});
    console.log(data.data.videos);

    if (data.data.videos.length > 0) setVideos(data.data.videos);
    else setVideos([]);
  }

  useEffect(() => {
    getMyVideos();
  }, []);

  useEffect(() => {
    getMyVideos();
  }, [isChange]);

  // async function setUrl(url) {
  //   loca
  // }

  return <>
    <Header />

    <section className="px-6 py-5 mb-4 light-bg">
      <h2 className="pb-3">My Videos</h2>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {videos.length > 0 ? videos.map((video, index) =>
            <VideoCard video={video} displaySave={false} displayDelete={true} setIsChange={setIsChange} key={index} />) 
          : <div>No videos uploaded.</div>
        }


      </div>

    </section >
    <Footer/>
  </>
}

export default MyVideos;
