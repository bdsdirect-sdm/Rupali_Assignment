


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Message {
    sender: 'agency' | 'jobSeeker';
    content: string;
}

const Chat: React.FC = () => {
    const { jobSeekerId } = useParams<{ jobSeekerId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`http://localhost:7018/api/chat/${jobSeekerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };

        fetchMessages();
    }, [jobSeekerId]);

    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        if (!token || newMessage.trim() === '') return;

        try {
            await axios.post(`http://localhost:7018/api/chat/${jobSeekerId}`, { content: newMessage }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages((prevMessages) => [...prevMessages, { sender: 'agency', content: newMessage }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat with Job Seeker</h2>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={message.sender === 'agency' ? 'message agency' : 'message job-seeker'}>
                        {message.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
        </div>
    );
};

export default Chat;
