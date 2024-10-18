

import { Request, Response } from "express";

let chatMessages: { [key: string]: string[] } = {};

export const getMessages = (req: Request, res: Response) => {
    const { id } = req.params;
    res.json(chatMessages[id] || []);
};

export const sendMessage = (req: Request, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!chatMessages[id]) {
        chatMessages[id] = [];
    }
    
    chatMessages[id].push(message);
    res.status(201).json({ message: 'Message sent' });
};
