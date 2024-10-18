import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import AgencyProfile from './components/agencyProfile';
import JobSeekerDashboard from './components/jobSeekerDashboard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Chat from './components/Chat';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agencyprofile" element={<AgencyProfile />} />
        <Route path="/jobseekerdashboard" element={<JobSeekerDashboard />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
        <Route path="/chat/:jobSeekerId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
