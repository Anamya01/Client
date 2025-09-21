// src/pages/JoinPage.js
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import './JoinPage.css';

export default function JoinPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const role = searchParams.get("role");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!role || !["teacher", "student"].includes(role)) {
      setError("Invalid role");
      return;
    }

    // Set user in Redux
    dispatch(setUser({
      name: name.trim(),
      role: role
    }));

    // Navigate to appropriate page
    navigate(role === "teacher" ? "/teacher" : "/student");
  };

  const getRoleText = () => {
    if (role === "teacher") {
      return {
        title: "Let's Get Started",
        description: "As a teacher, you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time."
      };
    } else {
      return {
        title: "Let's Get Started", 
        description: "If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates"
      };
    }
  };

  const roleInfo = getRoleText();

  return (
    <div className="joinpage">
      {/* Brand Header */}
      <div className="brand">
        <div className="brandlogo">
          <span className="brandicon">★</span>
          <span className="brandtext">Intervue Poll</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="joinpage-content">
        <div className="heading-section">
          <h1 className="main-head">{roleInfo.title}</h1>
          <p className="desc">{roleInfo.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="name-form">
          <div className="input-section">
            <label className="input-label">Enter your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Your name here..."
              className="name-input"
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="continue-btn"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}