import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobSeeker {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'pending' | 'accepted' | 'declined'; 
}

const AgencyProfile: React.FC = () => {
    const navigate = useNavigate();
    const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);

    useEffect(() => {
        const fetchJobSeekers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:7018/api/job-seekers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobSeekers(response.data);
            } catch (error) {
                console.error('Error fetching job seekers:', error);
            }
        };

        fetchJobSeekers();
    }, [navigate]);

    const handleAccept = async (id: string) => {
        try {
            await axios.post(`http://localhost:7018/api/job-seekers/${id}/accept`);
            setJobSeekers(prevSeekers => 
                prevSeekers.map(seeker => 
                    seeker.id === id ? { ...seeker, status: 'accepted' } : seeker
                )
            );
            alert('Job seeker accepted!');
            navigate(`/chat/${id}`); 
        } catch (error) {
            console.error('Error accepting job seeker:', error);
            alert('Failed to accept job seeker. Please try again.');
        }
    };

    const handleDecline = async (id: string) => {
        try {
            await axios.post(`http://localhost:7018/api/job-seekers/${id}/decline`);
            setJobSeekers(prevSeekers => 
                prevSeekers.map(seeker => 
                    seeker.id === id ? { ...seeker, status: 'declined' } : seeker
                )
            );
            alert('Job seeker declined!');
        } catch (error) {
            console.error('Error declining job seeker:', error);
            alert('Failed to decline job seeker. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-danger mb-3">Logout</button>
            <div className="card p-4 mt-3">
                <h2>Associated Job Seekers</h2>
                {jobSeekers.length === 0 ? (
                    <p>No job seekers associated with your agency.</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobSeekers.map((jobSeeker) => (
                                <tr key={jobSeeker.id}>
                                    <td>{jobSeeker.firstName}</td>
                                    <td>{jobSeeker.lastName}</td>
                                    <td>{jobSeeker.email}</td>
                                    <td>{jobSeeker.status}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleAccept(jobSeeker.id)} 
                                            className="btn btn-success"
                                            disabled={jobSeeker.status !== 'pending'}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleDecline(jobSeeker.id)} 
                                            className="btn btn-danger"
                                            disabled={jobSeeker.status !== 'pending'}
                                        >
                                            Decline
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/chat/${jobSeeker.id}`)} 
                                            className="btn btn-info"
                                            disabled={jobSeeker.status !== 'accepted'}
                                        >
                                            Chat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AgencyProfile;
