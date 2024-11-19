import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import VideoPlayer from './pages/videoPlayer'
import Login from './pages/login'
import Register from './pages/register'
import UploadVideo from './pages/upload'
import MyVideos from './pages/myVideos'
import Saved from './pages/saved'
import ListVideos from './pages/listVideos'



function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route index path='*' element={<Login />} />
        <Route index path='home' element={<Home />} />
        <Route path='video' element={<VideoPlayer />} />
        <Route path='upload' element={<UploadVideo />} />
        <Route path='myvideos' element={<MyVideos />} />
        <Route path='saved' element={<Saved />} />
        <Route path='listVideos' element={<ListVideos />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App