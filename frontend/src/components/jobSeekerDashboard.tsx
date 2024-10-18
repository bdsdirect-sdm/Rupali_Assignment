


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JobSeekerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [agencyDetails, setAgencyDetails] = useState<any>(null);
    const [isRequestAccepted, setIsRequestAccepted] = useState<boolean>(false);
    const{id}=useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const agency = localStorage.getItem('agencyDetails');

        if (!token) {
            navigate('/login'); 
        }

        if (agency) {
            setAgencyDetails(JSON.parse(agency)); 
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('agencyDetails');
        navigate('/login');
    };

    const handleAcceptChatRequest = async () => {
        try {
            const token = localStorage.getItem('token');
             console.log("token===",token)

            const response = await axios.post(`http://localhost:7018/api/jobseekersAccept/${id}`, {
               
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (response.status === 200) {
                setIsRequestAccepted(true);
               
              
            }
            navigate('/chat');
        } catch (error) {
            console.error('Error accepting chat request:', error);
            
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Job Seeker Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-danger mb-3">Logout</button>
            <div className="card p-4 mt-3">
                <h2>Your Agency Details</h2>
                {agencyDetails ? (
                    <div>
                        <p><strong>Agency Name:</strong> {agencyDetails.firstName} {agencyDetails.lastName}</p>
                        <p><strong>Email:</strong> {agencyDetails.email}</p>
                        <p><strong>Phone:</strong> {agencyDetails.phone}</p>
                         
                        {!isRequestAccepted && (
                            <button onClick={handleAcceptChatRequest} className="btn btn-primary mt-3">
                               Start Chat
                            </button>
                        )}
                        {isRequestAccepted && <p className="text-success">Chat request accepted!</p>}
                    </div>
                ) : (
                    <p>No agency associated with your profile.</p>
                )}
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
