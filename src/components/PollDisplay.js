// src/components/PollDisplay.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socket";
import { updatePoll } from "../store/pollSlice";

export default function PollDisplay() {
  const poll = useSelector(s => s.poll);
  const user = useSelector(s => s.user);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(poll.timeLimit || 60);

  // start local countdown when poll starts
  useEffect(() => {
    if (poll.status !== "active") return;
    setVoted(false);
    setSelected(null);
    setTimeLeft(poll.timeLimit || 60);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [poll.id]);

  useEffect(() => {
    // if server sends updates, reflect them (already handled by redux)
    // but if needed we can react here
  }, [poll]);

  const submitVote = (index) => {
    if (voted || poll.status !== "active") return;
    socket.emit("student:submitAnswer", { answerIndex: index }, (ack) => {
      if (ack && ack.status === "error") {
        alert("Error: " + ack.message);
      } else {
        setSelected(index);
        setVoted(true);
      }
    });
  };

  return (
    <div>
      <h2>{poll.question}</h2>
      <div>Time left: {timeLeft}s</div>
      <div style={{ marginTop: 12 }}>
        {poll.options.map((opt, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 8,
            border: "1px solid #ddd",
            padding: 8,
            borderRadius: 6,
            cursor: (poll.status === "active" && user.role === "student" && !voted) ? "pointer" : "default",
            background: selected === i ? "#f0f8ff" : "white"
          }}
            onClick={() => { if (user.role === "student" && poll.status === "active" && !voted) submitVote(i); }}>
            <div style={{ flex: 1 }}>{opt.text}</div>
            <div style={{ minWidth: 80, textAlign: "right" }}>{opt.count ?? 0} votes</div>
          </div>
        ))}
      </div>

      {poll.status === "finished" && (
        <div style={{ marginTop: 16 }}>
          <h3>Final Results</h3>
          <ul>
            {poll.options.map((o, i) => <li key={i}>{o.text} — {o.count}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
