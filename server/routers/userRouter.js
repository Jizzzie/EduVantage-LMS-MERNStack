//Express router module for handling user-related actions like 
//login, registration, and managing saved video lists.
import express from "express";
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import verifyToken from "../middlewares/VerifyToken.js";
import Video from "../models/video.js";

const router = express.Router();

router.post('/login', async (req, res) => { //sends info to server 
  try {
    const { email, pass } = req.body; // converts into JSON object what we get from user
    const user = await User.findOne({ email });// finds the same mail_id in server
    if (user) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email
      }
      if (user.password === pass) {
        let token = jwt.sign(payload, process.env.JWT_SECRET); //stores a secret key in env variable
        // now respons to client
        res.status(200).json({ msg: "Valid credentials", token, name: user.name, email: user.email });
      } else {
        res.status(202).json({ msg: "Invalid password" });//password error - 202
      }
    } else {
      res.status(203).json({ msg: "User not found" });// unfound user - 203
    }
    // console.log(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });//ser er error - 500
  }
})

router.post('/register', async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) { //if a user doesnt exist
      const newuser = await User({
        name,
        email,
        password: pass
      }).save();
      console.log(newuser);
      if (newuser) {
        res.status(201).json({ msg: "Account created" });
      }
    } else {
      res.status(203).json({ msg: "Account exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error in creating account" });
  }
});

// designed for checking if a specific video is present in each saved list.
router.post("/savedLists", verifyToken, async(req, res) => {
  // Verify token using middleware (verifyToken)
  try {
    const user = await User.findOne({ email: req.body.userdata.email });
    //await keyword ensures that the code waits
    // for this operation to complete before moving on to the next line.
    const {video_id} = req.body;
    if(user) {
      let lists = {};
      //iterate over the saved list
      for (let i = 0; i < Object.keys(user.savedLists).length; i++) {
        lists[Object.keys(user.savedLists)[i]] = false;
        // Check if the current saved list contains the specified video_id
        if (user.savedLists[Object.keys(user.savedLists)[i]].includes(video_id)) 
          lists[Object.keys(user.savedLists)[i]] = true; //adds it if so
      }
      res.status(200).json(lists);
    }
    else res.status(404).json({msg: "User not found"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

//provide information about the last element and the length of each saved list.
router.post("/savedLists2", verifyToken, async(req, res) => {
  try {
    const user = await User.findOne({ email: req.body.userdata.email });
    const {video_id} = req.body;
    if(user) {
      let lists = {};
      //Iterate over each saved list in the user's data
      for (let i = 0; i < Object.keys(user.savedLists).length; i++) {
        lists[Object.keys(user.savedLists)[i]] = [null, 0]; // initilaize null and 0
        let length = user.savedLists[Object.keys(user.savedLists)[i]].length; // find length of each saved list
        if (length > 0) 
        // Update the value for the current list in the 'lists' object
        // The new value is an array containing the last element of the saved list and its length
          lists[Object.keys(user.savedLists)[i]] = [user.savedLists[Object.keys(user.savedLists)[i]][length-1], length];
      }
      res.status(200).json(lists);
    }
    else res.status(404).json({msg: "User not found"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

//adds a video to a new playlist
router.post("/addSaveList", verifyToken, async(req, res) => {
  try {
    const user = await User.findOne({ email: req.body.userdata.email });
    const {listName, video_id} = req.body;
    if(user){
      console.log(listName);
      // Check if the specified saved list exists for the user and if the video_id is not already include
      if(user.savedLists[listName] && !user.savedLists[listName].includes(video_id)) 
        user.savedLists[listName].push(video_id);//adds or pushes the video into list
      else 
        user.savedLists[listName] = [video_id];//creates the new list
      user.markModified('savedLists');//mark the saved list as modified
      user.save();
      console.log(user);
      res.status(200).json({msg: "Video saved"});
    } 
    else res.status(404).json({msg: "User not found"});

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

router.post("/removeFromSaveList", verifyToken, async(req, res) => {
  try {
    const user = await User.findOne({ email: req.body.userdata.email });
    const {listName, video_id} = req.body;
    if(user){
    // Filter out the specified video_id from the saved list
      user.savedLists[listName] = user.savedLists[listName].filter(id => id != video_id);
      user.markModified('savedLists');
      user.save();
      res.status(200).json({msg: "Video removed"});
    } 
    else res.status(404).json({msg: "User not found"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

//displays all the videos
router.post("/listVideos", verifyToken, async(req, res) => {
  try {
    const user = await User.findOne({ email: req.body.userdata.email });
    const {listName} = req.body;
    if(user){
      let videoData = [];
      console.log(user.savedLists[listName].length);
      console.log(user.savedLists[listName]);
      for (let i=0; i<user.savedLists[listName].length; i++) {
        let data = await Video.find({ _id: user.savedLists[listName][i]});
        videoData[i] = data[0];
      }
      console.log(videoData);
      res.status(200).json(videoData);
    } 
    else res.status(404).json({msg: "User not found"});

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

//deletes a playlist
router.post("/removeSaveList", verifyToken, async(req, res) => {
  try {
    const user = await User.findOne({ email: req.body.userdata.email });
    const {listName} = req.body;
    if(user){
      delete user.savedLists[listName];
      user.markModified('savedLists');
      user.save();
      res.status(200).json({msg: "Savelist removed"});
    } 
    else res.status(404).json({msg: "User not found"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

export default router;