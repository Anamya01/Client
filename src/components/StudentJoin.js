// src/components/StudentJoin.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import socket from "../socket";

export default function StudentJoin() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "student");
  const dispatch = useDispatch();

  const handleJoin = async () => {
    dispatch(setUser({ name, role }));
    // If role is student, attempt to join active poll immediately (ack may error if no active poll)
    if (role === "student") {
      socket.emit("student:join", { name }, (resp) => {
        // ack: { status: 'ok' } or {status: 'error', message: 'No active poll to join'}
        if (resp && resp.status === "error") {
          // it's fine — student will wait for teacher
          console.log("join ack:", resp);
        } else {
          console.log("joined poll ack:", resp);
        }
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Enter your name and role</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
      <div style={{ marginTop: 8 }}>
        <label>
          <input type="radio" checked={role === "student"} onChange={() => setRole("student")} /> Student
        </label>
        <label style={{ marginLeft: 12 }}>
          <input type="radio" checked={role === "teacher"} onChange={() => setRole("teacher")} /> Teacher
        </label>
      </div>
      <button onClick={handleJoin} style={{ marginTop: 12 }} disabled={!name}>Continue</button>
    </div>
  );
}
