import { useEffect, useState } from "react"; //fetch 2 hooks that fetches data and manage state of a variable
import Header from "../components/Header";
import "./home.scss"; //sassy css
import axios from "axios"; // promise based fetching asynchronous data
import { useNavigate } from 'react-router-dom'; // hooks used to navigate btw pages
import Footer from "../components/Footer";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [filVideos, setFilVideos] = useState([]);
  const [searchInp, setSearchInp] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  async function getAllVideos() {
    const data = await axios.post("http://localhost:3000/video/allvideos", {}, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
    console.log(data.data.videos);

    if (data.data.videos.length > 0) {
      setVideos(data.data.videos);
      setFilVideos(data.data.videos);
    }
    else setVideos([]);
  }

  useEffect(() => {
    if (localStorage.getItem('token') == null || localStorage.getItem('token') == '') navigate('/login');
    else {
      getAllVideos();
    }
  }, [])

  useEffect(() => {
    if (isFocus) {
      const targetSection = document.getElementById('videos-section');
      if (targetSection) {
        const sectionTop = targetSection.offsetTop;
        const adjustedScrollPosition = sectionTop - 70;
        window.scrollTo({
          top: adjustedScrollPosition,
          behavior: 'smooth',
        });
      }
      setIsFocus(false);
    }
  }, [isFocus])

  function handleSearch(e) {
    e.preventDefault();
    setSearchInp(e.target.value);

    let filteredVids = videos.filter((vid) => {
      if (vid.title.toLowerCase().includes(searchInp.toLowerCase()) || vid.description.toLowerCase().includes(searchInp.toLowerCase())) return vid;
    }) // checks if title or description of any videos matches with what we searched
    console.log(filteredVids);
    if (e.target.value == '') setFilVideos(videos);
    else setFilVideos(filteredVids);
    setIsFocus(true);
  }

  return <>
    <Header //all the prop used in header for the search bar are as belows
      searchInp={searchInp} 
      setSearchInp={setSearchInp} 
      handleSearch={handleSearch} 
      setIsFocus={setIsFocus} />

    <div id="carousel" className="carousel slide flex-fill" data-bs-ride="carousel"> 
    {/* Bootstrap used to get carousel bar */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="3000">
         <img src="https://www.sentrium.co.uk/cdn-cgi/image/width=1920,height=1080,fit=crop,quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/2021/06/How-secure-use-of-the-cloud-can-digitally-transform-your-business.jpeg" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block text-white ">
            <h5>DBT - RUPALI WAGH</h5>
            <p>Database Management System (DBMS) is a software that organizes, retrieves, and manages data; SQL-based systems like MySQL enforce structured querying, while MongoDB, a NoSQL DBMS, embraces a flexible, document-oriented approach.</p>
          </div> 
        </div>
        <div className="carousel-item" data-bs-interval="3000">
        <img src="https://w0.peakpx.com/wallpaper/59/567/HD-wallpaper-web-designing-training-in-pune-web-design-web-design-training-in-pune-website-design-training-web-development-course-in-pune-web-development-training-in-india-website-design-training-in-india.jpg" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block text-white ">
            <h5>FSWD - VYSHALI GOGI</h5>
            <p>Full-stack web development involves mastering a spectrum of technologies, from crafting engaging user interfaces to architecting efficient server-side systems, enabling developers to navigate the entire web development landscape</p>
          </div>
    
        </div>
        <div className="carousel-item">
          <img src="https://cdn.sanity.io/images/tlr8oxjg/production/783a1a13cc1dfd0b360cb57816669478c9ffbfe0-1456x816.png?w=3840&q=80&fit=clip&auto=format" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block text-white">
            <h5>ISR - AKSHITA SHARMA</h5>
            <p>Inferential statistics in R enable data analysts to draw meaningful insights from a sample to make generalizations about a population, utilizing methods such as hypothesis testing and confidence intervals.</p>
          </div>
        </div>
      </div>
    </div>
    
    <section className="light-bg" id="bg">
    <section className="px-6 py-5 mb-4" id="videos-section">
      <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2 g-5"> 
        {
          // Checks if filvideo leangth is 0 and then 
          //maps over each element in filVideos array and returns a VideoCard component for each video if not 0
          // Inside the map function where you render VideoCard components
          filVideos.length > 0 ? filVideos.map((video, index) => 
          <VideoCard 
            video={video} 
            displaySave={true} 
            displayRemove={false} 
            key={index} 
            className="video-card" // Add the video-card class here
          />)
          : <div className="">No videos uploaded.</div>

        }
      </div>
    </section >
    </section>
    <Footer/>
  </>
}

export default Home;
