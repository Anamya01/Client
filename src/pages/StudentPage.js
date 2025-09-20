// src/pages/StudentPage.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { setJoinStatus } from "../store/userSlice";
import { setUserAnswer } from "../store/pollSlice";
import { addMessage } from "../store/chatSlice";
import './StudentPage.css';

export default function StudentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(s => s.user);
  const poll = useSelector(s => s.poll);
  const students = useSelector(s => s.students);
  const messages = useSelector(s => s.chat);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatTab, setChatTab] = useState('chat');
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user.name || user.role !== "student") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Join poll when component mounts or new poll starts
  useEffect(() => {
    if (!user.name || user.isJoined) return;

    const joinPoll = () => {
      socket.emit("student:join", { name: user.name }, (response) => {
        if (response) {
          if (response.status === "ok") {
            dispatch(setJoinStatus({ isJoined: true, error: null }));
          } else {
            dispatch(setJoinStatus({ 
              isJoined: false, 
              error: response.message 
            }));
          }
        }
      });
    };

    joinPoll();
  }, [user.name, user.isJoined, poll.id, dispatch]);

  // Timer for active poll
  useEffect(() => {
    if (poll.status !== "active" || !poll.startedAt) return;

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - poll.startedAt) / 1000);
      const remaining = Math.max(0, poll.timeLimit - elapsed);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [poll.status, poll.startedAt, poll.timeLimit]);

  // Handle removal
  useEffect(() => {
    const handleRemoved = () => {
      navigate("/kicked");
    };

    socket.on("removed", handleRemoved);
    return () => socket.off("removed", handleRemoved);
  }, [navigate]);

  const selectOption = (optionIndex) => {
    if (poll.hasAnswered || poll.status !== "active") return;
    setSelectedOption(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedOption === null || poll.hasAnswered || poll.status !== "active") return;

    socket.emit("student:submitAnswer", { answerIndex: selectedOption }, (response) => {
      if (response) {
        if (response.status === "ok") {
          dispatch(setUserAnswer(selectedOption));
        } else {
          alert("Error: " + response.message);
          setSelectedOption(null);
        }
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      sender: user.name,
      role: user.role,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    socket.emit("chat_message", msg);
    dispatch(addMessage(msg));
    setNewMessage("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user.name) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="student-page-new">
      <div className="student-container">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-badge">
            <span className="brand-icon">★</span>
            <span className="brand-text">Intervue Poll</span>
          </div>
        </div>

        {/* Waiting State */}
        {poll.status === "idle" && (
          <div className="waiting-state">
            <div className="loading-spinner"></div>
            <h2 className="waiting-title">Wait for the teacher to ask questions..</h2>
          </div>
        )}

        {/* Active Poll */}
        {poll.status === "active" && (
          <div className="poll-active">
            <div className="poll-header">
              <h2 className="poll-question-title">Question</h2>
              <div className="timer">
                <span className="timer-icon">⏰</span>
                <span className="timer-text">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">{poll.question}</div>
              
              <div className="options-container">
                {poll.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedOption === index ? 'selected' : ''} ${poll.hasAnswered ? 'disabled' : ''}`}
                    onClick={() => selectOption(index)}
                    disabled={poll.hasAnswered}
                  >
                    <div className="option-circle">{index + 1}</div>
                    <div className="option-text">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>

            {!poll.hasAnswered && (
              <div className="submit-section">
                <button
                  className="submit-btn"
                  onClick={submitAnswer}
                  disabled={selectedOption === null}
                >
                  Submit
                </button>
              </div>
            )}

            {poll.hasAnswered && (
              <div className="submitted-state">
                <div className="check-icon">✓</div>
                <p>Answer submitted! Waiting for results...</p>
              </div>
            )}
          </div>
        )}

        {/* Poll Results */}
        {poll.status === "finished" && (
          <div className="poll-results">
            <div className="results-header">
              <h2 className="poll-question-title">Question 1</h2>
              <div className="timer completed">
                <span className="timer-icon">⏰</span>
                <span className="timer-text">{formatTime(0)}</span>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">{poll.question}</div>
              
              <div className="results-container">
                {poll.options.map((option, index) => {
                  const total = poll.options.reduce((sum, opt) => sum + opt.count, 0);
                  const percentage = total > 0 ? Math.round((option.count / total) * 100) : 0;
                  const isUserChoice = poll.userAnswer === index;
                  
                  return (
                    <div 
                      key={index} 
                      className={`result-option ${isUserChoice ? 'user-choice' : ''}`}
                    >
                      <div className="option-content">
                        <div className="option-circle">{index + 1}</div>
                        <div className="option-name">{option.text}</div>
                      </div>
                      <div className="result-progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="result-percentage">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="waiting-message">
              <p>Wait for the teacher to ask a new question.</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Popup - Only show during active poll or results */}
      {(poll.status === "active" || poll.status === "finished") && (
        <>
          <button
            className="chat-float-btn"
            onClick={() => setShowChatPopup(!showChatPopup)}
          >
            💬
          </button>

          {showChatPopup && (
            <div className="chat-popup-overlay">
              <div className="chat-popup">
                <div className="chat-header">
                  <div className="chat-tabs">
                    <button
                      className={`chat-tab ${chatTab === 'chat' ? 'active' : ''}`}
                      onClick={() => setChatTab('chat')}
                    >
                      Chat
                    </button>
                    <button
                      className={`chat-tab ${chatTab === 'participants' ? 'active' : ''}`}
                      onClick={() => setChatTab('participants')}
                    >
                      Participants
                    </button>
                  </div>
                  <button
                    className="chat-close"
                    onClick={() => setShowChatPopup(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="chat-content">
                  {chatTab === 'chat' && (
                    <div className="chat-messages">
                      {messages.length === 0 ? (
                        <div className="no-messages">No messages yet</div>
                      ) : (
                        messages.map((msg, index) => (
                          <div key={index} className="message">
                            <div className="message-header">
                              <span className="message-sender">{msg.sender}</span>
                              <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="message-text">{msg.text}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {chatTab === 'participants' && (
                    <div className="participants-list">
                      <div className="participants-header">
                        <span>Name</span>
                        <span>Status</span>
                      </div>
                      {students.map(student => (
                        <div key={student.socketId} className="participant-row">
                          <span className="participant-name">{student.name}</span>
                          <span className="participant-status">Online</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {chatTab === 'chat' && (
                  <form onSubmit={sendMessage} className="chat-input-form">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="chat-input"
                    />
                    <button type="submit" className="send-btn">Send</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}