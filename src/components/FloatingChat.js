// src/components/FloatingChat.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socket";
import { addMessage } from "../store/chatSlice";
import { removeStudent } from "../store/studentsSlice";
import './FloatingChat.css';

export default function FloatingChat() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user);
  const students = useSelector(s => s.students);
  const messages = useSelector(s => s.chat);
  
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatTab, setChatTab] = useState('chat');
  const [newMessage, setNewMessage] = useState("");

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
    // dispatch(addMessage(msg));
    setNewMessage("");
  };

  const removeStudentHandler = (studentId, studentName) => {
    if (user.role !== "teacher") return;
    
    if (window.confirm(`Remove ${studentName} from the poll?`)) {
      socket.emit("remove-student", { studentId }, (response) => {
        if (response && response.status === "error") {
          alert("Error: " + response.message);
        } 
        // else {
        //   dispatch(removeStudent(studentId));
        // }
      });
    }
  };

  return (
    <>
      <button
        className="chat-float-btn"
        onClick={() => setShowChatPopup(!showChatPopup)}
        title="Open Chat"
      >
        💬
      </button>

      {showChatPopup && (
        <div className="chat-popup-overlay" onClick={() => setShowChatPopup(false)}>
          <div className="chat-popup" onClick={e => e.stopPropagation()}>
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
                title="Close Chat"
              >
                ×
              </button>
            </div>

            <div className="chat-content">
              {chatTab === 'chat' && (
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>No messages yet</p>
                      <p>Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.role}`}>
                        <div className="message-header">
                          <span className="message-sender">{msg.sender}</span>
                          <span className={`role-badge ${msg.role}`}>
                            {msg.role}
                          </span>
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
                    <span>Action</span>
                  </div>
                  {students.length === 0 ? (
                    <div className="no-participants">
                      <p>No participants yet</p>
                    </div>
                  ) : (
                    students.map(student => (
                      <div key={student.socketId} className="participant-row">
                        <div className="participant-info">
                          <span className="participant-name">{student.name}</span>
                        </div>
                        {user.role === "teacher" && (
                          <button
                            className="kick-btn"
                            onClick={() => removeStudentHandler(student.socketId, student.name)}
                          >
                            Kick out
                          </button>
                        )}
                      </div>
                    ))
                  )}
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
                  maxLength={500}
                />
                <button 
                  type="submit" 
                  className="send-btn"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}