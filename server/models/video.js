import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  videoUrl: String,
  description: String,
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
