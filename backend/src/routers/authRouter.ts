import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Router } from 'express';
// import { registerUser, loginUser, getAgencies, updateJobSeekerStatus } from '../controllers/authController';
import { sendMessage, getMessages } from '../controllers/chatController';
import { acceptJobSeeker, declineJobSeeker, getAgencies, getJobSeekers, loginUser } from '../controllers/authController';
import { registerUser } from '../controllers/authController'; // Adjust the path as needed


const router = express.Router();


const uploadsDir = path.join(__dirname, '..', 'uploads');


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    console.log("hereree",file)
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage });


router.post('/register', upload.fields([{ name: 'profileImage' }, { name: 'resume' }]), registerUser);
router.post('/login',loginUser)
router.get('/agencies',getAgencies)
router.post('/register', registerUser);
router.get('/job-seekers', getJobSeekers);

// Accept a job seeker
router.post('/jobseekersAccept/:id', acceptJobSeeker);

// Decline a job seeker
router.post('/job-seekers/:id/decline', declineJobSeeker);


// router.post('/update-status', updateJobSeekerStatus);
router.post('/send', sendMessage);
router.get('/messages', getMessages);

export default router;
