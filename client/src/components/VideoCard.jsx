import { useEffect, useRef, useState } from "react";
import PlayIcon from "../assets/play.png";
import SaveIcon from "../assets/save.png";
import BinIcon from "../assets/bin.png";
import axios from "axios";

const VideoCard = ({ video, displaySave, displayRemove, displayDelete, setIsChange }) => {
  const [listName, setlistName] = useState('');
  const [isSave, setIsSave] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [savedLists, setSavedLists] = useState({});
  const ind = useRef(0);
  function x() {
    getPlaylists();
    setIsSave(true);
    setlistName('');
    setIsCreate(false);
    console.log("xxx");
  }
  async function getPlaylists() {
    const data = await axios.post("http://localhost:3000/account/savedLists", { video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
    console.log(data.data);
    if (Object.keys(data.data).length > 0)
      setSavedLists(data.data);
  }

  async function createPlaylist() {
    const data = await axios.post("http://localhost:3000/account/addSaveList", { listName, video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });

    if (data.status == 200)
      setSavedLists(prev => {
        return { ...prev, [listName]: true };
      });
    setIsCreate(false);
  }

  async function handleCheckbox(e) {
    if (e.target.checked) {
      const data = await axios.post("http://localhost:3000/account/addSaveList", { listName: e.target.value, video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
      console.log(savedLists[e.target.value]);
      console.log(e.target.value);

      if (data.status == 200)
        setSavedLists(prev => {
          return { ...prev, [e.target.value]: true };
        });
    }
    else {
      const data = await axios.post("http://localhost:3000/account/removeFromSaveList", { listName: e.target.value, video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });

      if (data.status == 200)
        setSavedLists(prev => {
          return { ...prev, [e.target.value]: false };
        });
    }
  }
  async function removeVideo() {
    let listName = localStorage.getItem('list');
    const data = await axios.post("http://localhost:3000/account/removeFromSaveList", { listName, video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
      if (data.status == 200)
        setSavedLists(prev => {
          return { ...prev, [listName]: false };
        });
  }

  async function deleteVideo() {
    const data = await axios.post("http://localhost:3000/video/deleteVideo", { video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
      if (data.status == 200)
        setIsChange(prev => !prev);
  }

  async function addToPlaylist() {
    const data = await axios.post("http://localhost:3000/account/addSaveList", { listName, video_id: video._id }, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
    if (data.status == 200)
      setSavedLists(prev => prev[listName].push(video._id));
  }

  useEffect(() => {
    if (setIsChange)
      setIsChange(prev => !prev);

  }, [savedLists])

  return <div className="col">
    <div className="card border-0 overflow-hidden h-100 bg-transparent" >
      <video className="shadow-sm rounded" key={ind.current++}>
        <source src={'http://localhost:3000/video/video?id=' + video._id} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="card-body px-0">
        <h5 className="card-title">{video.title}</h5>
        <p className="card-text">{video.description.length > 50 ? video.description.substring(0, 50) + '...' : video.description + '.'}</p>
        <div>
          <a onClick={() => localStorage.setItem('video_id', video._id)} href="/video" className="btn secondary-button shadow-sm text-white "><img src={PlayIcon} /> Watch</a>
          {displaySave &&
            <button type="button" className="btn secondary-button shadow-sm text-white ms-2" role="button" onClick={x}><img src={SaveIcon} /> Save
            </button>
          }
          {displayRemove &&
            <button id="red-bg" type="button" className="btn secondary-button shadow-sm text-white ms-2" role="button" onClick={removeVideo}><img src={BinIcon} /> Remove
            </button>
          }
          {displayDelete &&
            <button id="red-bg" type="button" className="btn secondary-button shadow-sm text-white ms-2" role="button" onClick={deleteVideo}><img src={BinIcon} /> Delete
            </button>
          }
        </div>
      </div>
    </div>

    {isSave &&
      <div className="black-screen">
        <div className="save-modal">
          <div className="d-flex justify-content-between mb-4">
            Save video to...
            <button className="btn-close btn-close-white" onClick={() => setIsSave(false)}></button>
          </div>

          {Object.keys(savedLists).length > 0 &&
            Object.keys(savedLists).map((list, i) =>
              <div className="d-flex gap-3 mb-2" key={i}>
                <input id={i} type="checkbox" onChange={handleCheckbox} value={list} checked={savedLists[list]} /> <label htmlFor={i}> {list} </label>
              </div>
            )
          }

          {isCreate ?
            <div>
              <input type="text" className="mt-3" placeholder="Enter playlist name..." value={listName} onChange={(e) => setlistName(e.target.value)} />
              <button className="btn secondary-button float-end mt-3" onClick={createPlaylist}>Create</button>
            </div> :
            <button className="btn w-100 text-white mt-2" onClick={() => setIsCreate(true)}>+ Create a new playlist</button>
          }
        </div>
      </div>
    }
  </div>
}
export default VideoCard;