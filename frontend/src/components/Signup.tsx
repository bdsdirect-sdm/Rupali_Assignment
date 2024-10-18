import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css'; 
import { useNavigate } from 'react-router-dom';

interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    userType: string;
    hobbies: string[];
    profileImage: File | null;
    agency: string; 
    resume: File | null;
}

interface Agency {
    id: string; 
    firstName: string;
    lastName: string;
}

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [formData, setFormData] = useState<SignupFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        userType: 'Job Seeker', 
        hobbies: [],
        profileImage: null,
        resume: null,
        agency: '', 
    });

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const response = await axios.get('http://localhost:7018/api/agencies');
                setAgencies(response.data);
            } catch (error) {
                console.error('Error fetching agencies:', error);
            }
        };

        fetchAgencies();
    }, []);

    const handleAgencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAgency(event.target.value);
        setFormData({ ...formData, agency: event.target.value }); 
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'phone' && !/^\d*$/.test(value)) {
            return; 
        }

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                hobbies: checked
                    ? [...prev.hobbies, value]
                    : prev.hobbies.filter(hobby => hobby !== value),
            }));
        } else if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (name === 'profileImage' && files) {
                setFormData({ ...formData, profileImage: files[0] });
            } else if (name === 'resume' && files) {
                setFormData({ ...formData, resume: files[0] });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();

        for (const key in formData) {
            const value = formData[key as keyof SignupFormData];
            if (Array.isArray(value)) {
                value.forEach(hobby => {
                    data.append('hobbies', hobby);
                });
            } else if (value !== null) {
                data.append(key, value);
            }
        }

        console.log('Form Data to be submitted:', Array.from(data.entries()));

        try {
            await axios.post('http://localhost:7018/api/register', data);
            alert('Signup successful! Please check your email for login details.');
            navigate('/login');
        } catch (error: any) {
            console.log(error.message, '     errroo')
            alert('Error signing up. Please try again.');
        }
    };

    return (
        <div className="signup-container d-flex align-items-center justify-content-center min-vh-100">
            <div className="signup-form shadow-lg p-4 rounded">
                <h2 className="text-center mb-4">Job Portal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>First Name</label>
                        <input
                            name="firstName"
                            onChange={handleChange}
                            required
                            placeholder="First Name"
                            className="form-control form-input"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Last Name</label>
                        <input
                            name="lastName"
                            onChange={handleChange}
                            required
                            placeholder="Last Name"
                            className="form-control form-input"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email</label>
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
                        <label>Phone No</label>
                        <input
                            name="phone"
                            type="tel"
                            onChange={handleChange}
                            required
                            placeholder="Phone"
                            className="form-control form-input"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender:</label>
                        <div>
                            <label className="me-3">
                                <input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Female" onChange={handleChange} required /> Female
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">User Type:</label>
                        <select name="userType" onChange={handleChange} className="form-select form-input">
                            <option value="Job Seeker">Job Seeker</option>
                            <option value="Agency">Agency</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hobbies:</label>
                        <div>
                            <label className="me-3">
                                <input type="checkbox" value="Sports" onChange={handleChange} /> Sports
                            </label>
                            <label className="me-3">
                                <input type="checkbox" value="Dance" onChange={handleChange} /> Dance
                            </label>
                            <label className="me-3">
                                <input type="checkbox" value="Reading" onChange={handleChange} /> Reading
                            </label>
                            <label>
                                <input type="checkbox" value="Singing" onChange={handleChange} /> Singing
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label>Profile Image</label>
                        <input type="file" name="profileImage" onChange={handleChange} accept=".png, .jpg, .jpeg" className="form-control form-input" />
                    </div>
                    {formData.userType === 'Job Seeker' && (
                        <>
                            <div className="mb-3">
                                <label>Resume</label>
                                <input type="file" name="resume" onChange={handleChange} accept=".docx, .pdf" className="form-control form-input" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="agency-select">Select Agency:</label>
                                <select id="agency-select" value={selectedAgency} onChange={handleAgencyChange} className="form-select form-input">
                                    <option value="">--Select an Agency--</option>
                                    {agencies.map((agency) => (
                                        <option key={agency.id} value={agency.id}>
                                            {agency.firstName} {agency.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                    <div className="mt-3 text-center">
                        {/* <a href="/login">Already have an account? Login</a> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

