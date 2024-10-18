



import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7018/api/login', formData);
            const { token, associatedJobSeekers, agencyDetails } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                if (associatedJobSeekers) {
                    localStorage.setItem('associatedJobSeekers', JSON.stringify(associatedJobSeekers));
                    alert('Login successful');
                    navigate('/agencyprofile');
                } else if (agencyDetails) {
                    localStorage.setItem('agencyDetails', JSON.stringify(agencyDetails));
                    alert('Login successful');
                    navigate('/jobseekerdashboard');
                } else {
                    alert('Login successful');
                    navigate('/jobseekerdashboard');
                }
            } else {
                alert('Login failed, no token received');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Invalid email or password. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
            <div className="login-form shadow-lg p-4 rounded">
                <h2 className="text-center mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            required
                            placeholder="Email"
                            className="form-control form-input"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="form-control form-input"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="mt-3 text-center">
                        <a href="/signup" className="signup-link">Don't have an account? Sign Up</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;












