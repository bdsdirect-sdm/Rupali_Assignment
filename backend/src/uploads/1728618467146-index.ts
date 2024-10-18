import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db';
import cors from 'cors';
import router from './Router/authRouter';
import multer from 'multer';

const PORT = process.env.PORT || 5004;

dotenv.config();
const app=express();
app.use(cors());    
app.use(express.json())

app.use(express.static('uploads'));
app.use("/api",router)

sequelize.sync().then(() => {
  
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  
 