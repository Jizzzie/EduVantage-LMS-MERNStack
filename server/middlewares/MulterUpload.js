import multer from 'multer'; //popular middleware for handling file uploads
import fs from 'fs'; // file system module
import path from 'path';

const storage = multer.diskStorage({ //store data 
  destination: (req, file, cb) => {
    const fileName = file.originalname;
    const folderName = fileName.split('_')[0]; //creates a folder whith filname before _
    const folderPath = path.join('./Videos', folderName);
    fs.mkdirSync(folderPath, { recursive: true }); //creating parent directories 
    // fs.mdir is a sync method to create new directories at specified path
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // process the uploaded data
export default upload; // the uploaded data is exported to other parts