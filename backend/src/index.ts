
import express from 'express';
import sequelize from './config/db';
import router from './routers/authRouter';
import cors from 'cors';
import { Server } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);


const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

   
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

      
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Failed to sync database:', error);
    }
};

syncDatabase();


app.listen(7018, () => {
    console.log('Server is running on port 7018');
});
