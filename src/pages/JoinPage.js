// src/pages/JoinPage.js
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import './Style.css'
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

    return (
        <div className="home">
            <div className="description">
                <h1 className="">
                    Lets Get Started
                </h1>
                <p>
                    if you are a student youll be able to submit answers, participate in live polls, and see how your responses compare with your classmates
                </p>
                </div>
                <form onSubmit={handleSubmit} className="">
                    <div className="input-form">
                        <p className="">
                            Enter Your Name
                        </p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter your name"
                            className=""
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className=""
                    >
                        Continue
                    </button>
                </form>
        </div>
    );
}