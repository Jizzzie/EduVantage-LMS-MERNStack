import express from "express";
import Video from '../models/video.js';
import User from '../models/user.js';
import verifyToken from "../middlewares/VerifyToken.js";
import upload from "../middlewares/MulterUpload.js";

const router = express.Router();
const rootVideoDir = "/Users/JUBY SABU/OneDrive/Desktop/WSD_Project-main/WSD_Project-main/server/Videos/";

router.post('/videoData', verifyToken, async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.userdata.email });

    if (user) {
      const data = await Video.findOne({ _id: req.body.body.video_id }).lean();
      const isLiked = user.likedVideoList.includes(req.body.body.video_id);
      const isDisliked = user.dislikedVideoList.includes(req.body.body.video_id);
      data.isLiked = isLiked;
      data.isDisliked = isDisliked;
      res.status(200).json({ data });
    }
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching video' });
  }
})

router.post('/likeDislike', verifyToken, async (req, res) => {
  try {
    const { video_id, isLike, isDislike } = req.body.payload;
    const video = await Video.findOne({ _id: video_id });
    const user = await User.findOne({ email: req.body.userdata.email });
    console.log(video && user && isLike);
    if (video && user && isLike) {
      if (isLike == 1) {
        video.likes += 1;
        user.likedVideoList.push(video_id);
        user.markModified('likedVideoList');
      }
      else if (isLike == -1) {
        video.likes -= 1;
        user.likedVideoList = user.likedVideoList.filter(video => video !== video_id);
        user.markModified('likedVideoList');
      }
    }
    if (video && user && isDislike) {
      if (isDislike === 1) {
        video.dislikes += 1;
        user.dislikedVideoList.push(video_id);
        user.markModified('dislikedVideoList');
      }
      else if (isDislike === -1) {
        video.dislikes -= 1;
        user.dislikedVideoList = user.dislikedVideoList.filter(video => video !== video_id);
        user.markModified('dislikedVideoList');
      }
    }
    user.save();
    video.save();
    res.status(200).json({ msg: "Likes & Dislikes updated." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error updating Likes & Dislikes' });
  }
})

router.post('/upload', verifyToken, upload.single('video'), async (req, res) => {
  try {
    const userEmail = req.body.fileName.split('_')[0];
    const fileName = req.body.fileName;

    const video = new Video({
      name: req.body.name,
      email: userEmail,
      title: req.body.title,
      videoUrl: `${userEmail}/${fileName}`,
      description: req.body.desc
    }).save();

    if (video) res.status(201).json({ msg: 'Video uploaded successfully' });
    else res.status(500).json({ msg: 'Error in uploading video' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});


router.post('/myvideos', verifyToken, async (req, res) => {
  try {
    const data = await Video.find({ email: req.body.email });
    res.status(200).json({ videos: data });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
})

router.post('/deleteVideo', verifyToken, async (req, res) => {
  try {
    const data = await Video.deleteOne({ _id: req.body.video_id });
    res.status(200).json({ msg: "Video deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

router.post('/allvideos', verifyToken, async (req, res) => {
  try {
    const data = await Video.find({});
    res.status(200).json({ videos: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

router.get('/video', async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.query.id });
    res.sendFile(rootVideoDir + video.videoUrl, { root: '/' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching video' });
  }
})

export default router;