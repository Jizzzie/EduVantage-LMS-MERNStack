import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserRouter from './routers/userRouter.js';
import VideoRouter from './routers/videoRouters.js';

dotenv.config(); //keep sensitive info like API away
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));
//sets up CORS (Cross-Origin Resource Sharing) to allow requests from 5173

//connects db
mongoose.connect("mongodb://0.0.0.0/eV", { useNewUrlParser: true })
  .then(console.log("Connected to DB"))
  .catch((error) => { console.log(error) });
  
//set up routes for handling requests 
app.use("/account", UserRouter);
app.use("/video", VideoRouter);

app.listen(3000);