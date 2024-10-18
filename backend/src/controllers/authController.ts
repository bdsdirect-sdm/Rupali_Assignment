import { Request, Response } from "express";
import User from "../models/user.model";
import { sendWelcomeEmail } from "../config/mailer";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const registerUser = async (req: any, res: any) => {
    try {
        const checkExistingUser = await User.findOne({ where: { email: req.body.email } });
        if (checkExistingUser) {
            return res.status(400).json({
                message: "This email is taken, try another",
                data: null
            });
        } else {
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                userType: req.body.userType,
                hobbies: req.body.hobbies,
                profileImage: req.files['profileImage'][0].path,
                resume: req.body.userType === 'Job Seeker' ? req.files['resume'][0].path : null,
                agencyId: req.body.userType === 'Job Seeker' ? req.body.agency : null,
                password: hashedPassword,
            };
  
            const newUser = await User.create(user);
            
            if (newUser.userType === 'Agency') {
                newUser.agencyId = newUser.id; 
                await newUser.save(); 
            }
        
            await sendWelcomeEmail(newUser.email, password);
            
            return res.status(201).json({
                message: "User added successfully",
                user: newUser,
            });
        }
    } catch (error: any) {
        console.error('Error adding user:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: any) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, 'rupali', {
            expiresIn: '1h',
        });

        let associatedJobSeekers = null;
        let agencyDetails = null;

        if (user.userType === 'Agency') {
            associatedJobSeekers = await User.findAll({
                where: {
                    agencyId: user.id,
                    userType: 'Job Seeker', 
                    status: 'pending', 
                },
            });
        } else if (user.userType === 'Job Seeker') {
            agencyDetails = await User.findOne({
                where: { id: user.agencyId },
            });
        }

        res.status(200).json({ token, associatedJobSeekers, agencyDetails });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getAgencies = async (req: Request, res: any) => {
    try {
        const agencies = await User.findAll({ where: { userType: 'Agency' } });
        return res.status(200).json(agencies);
    } catch (error) {
        console.log('Error fetching agencies', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all job seekers
export const getJobSeekers = async (req: Request, res: Response) => {
    try {
        const jobSeekers = await User.findAll({ where: { userType: 'Job Seeker' } });
        res.json(jobSeekers);
    } catch (error) {
        console.error('Error fetching job seekers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const acceptJobSeeker = async (req: Request, res: Response) => {
    const { id } = req.params;
    const jobSeeker = await User.findOne({ where: { id, userType: 'Job Seeker', status: 'pending' } });

    if (jobSeeker) {
        jobSeeker.status = 'accepted'; 
        await jobSeeker.save();
        res.status(200).json({ message: 'Job seeker accepted' });
    } else {
        res.status(400).json({ message: 'Job seeker not found or already processed' });
    }
};

// Decline a job seeker
export const declineJobSeeker = async (req: Request, res: Response) => {
    const { id } = req.params;
    const jobSeeker = await User.findOne({ where: { id, userType: 'Job Seeker', status: 'pending' } });

    if (jobSeeker) {
        jobSeeker.status = 'declined'; 
        await jobSeeker.save();
        res.status(200).json({ message: 'Job seeker declined' });
    } else {
        res.status(400).json({ message: 'Job seeker not found or already processed' });
    }
};