import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import BinIcon from "../assets/bin.png";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [lists, setLists] = useState({});
  const navigate = useNavigate();

  async function getMyVideos() {
    const data = await axios.post("http://localhost:3000/video/myvideos", { email: localStorage.getItem('email') }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
    console.log(data.data.videos);

    if (data.data.videos.length > 0) setVideos(data.data.videos);
    else setVideos([]);
  }

  async function getPlaylists() {
    const data = await axios.post("http://localhost:3000/account/savedLists2", {}, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
    console.log(data.data);

    if (Object.keys(data.data).length > 0)
      setLists(data.data);
  }

  useEffect(() => {
    getMyVideos();
    getPlaylists();
  }, []);

  async function viewList(list) {
    localStorage.setItem('list', list);
    navigate('/listVideos');
  }

  async function removePlaylist(listName) {
    const data = await axios.post("http://localhost:3000/account/removeSaveList", { listName }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
    console.log(data.data);

    if (data.status == 200)
      setLists(prev => {
        const { [listName]: deletedList, ...updatedLists } = prev;
        return updatedLists;
      });
  }

  return <>
    <Header />

    <section className="px-6 py-5 mb-4 light-bg">
      <h2 className="pb-3">Savelists</h2>

      <div className="row row-cols-1 row-cols-md-2 row-gap-4 ">
        {Object.keys(lists).length > 0 ? Object.keys(lists).map((list, index) =>
          <div className="px-2" key={index}>
            <div className="card mb-3 h-100 overflow-hidden shadow border-0 ">
              <div className="row g-0 h-100">
                <div className="col-md-4 overflow-hidden ">
                  {lists[list][0] ?
                    <video style={{ width: '100%', height: '100%', transform: 'scale(1.5)', }}>
                      <source src={'http://localhost:3000/video/video?id=' + lists[list][0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    : <div className="h-100 gray-bg">

                    </div>}

                </div>
                <div className="col-md-8">
                  <div className="card-body d-flex flex-column h-100 justify-content-between ">
                    <div className="d-flex w-100 align-items-baseline gap-1 ">
                      <h5 className="card-title text-capitalize m-0 ">{list}</h5>
                      <p className="card-text"><span className="text-muted">({lists[list][1]} videos)</span></p>
                    </div>

                    <div className="d-flex gap-1">
                      <button type="button" className="btn secondary-button shadow-sm text-white flex-fill " role="button" onClick={() => viewList(list)} > View Savelist
                      </button>
                      <button id="red-bg" type="button" className="btn secondary-button shadow-sm text-white" role="button" onClick={() => removePlaylist(list)} title="Delete Savelist" > <img src={BinIcon} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>)

          : <div>No videos uploaded.</div>
        }
      </div>
    </section >
    <Footer/>
  </>
}

export default Saved;
