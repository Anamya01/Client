// src/pages/HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    navigate(`/join?role=${selectedRole}`);
  };

  return (
    <div className="homepage">
      {/* Brand Header */}
      <div className="brand">
        <div className="brandlogo">
          <span className="brandicon">★</span>
          <span className="brandtext">Intervue Poll</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="homepage-content">
        <div className="home-section">
          <h1 className="title">Welcome to the <span className="highlight">Live Polling System</span></h1>
          <p className="sub">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className="role-selection">
          <div 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('student')}
          >
            <h3 className="role-title">I'm a Student</h3>
            <p className="role-description">
              Submit answers and view live poll results in real-time.
            </p>
          </div>

          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('teacher')}
          >
            <h3 className="role-title">I'm a Teacher</h3>
            <p className="role-description">
              Create polls, manage students, and monitor responses in real-time.
            </p>
          </div>
        </div>

        <button 
          className={`continue-btn ${selectedRole ? 'active' : ''}`}
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
}