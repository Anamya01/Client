// src/components/ChatBox.js
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ChatBox({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const messages = useSelector(s => s.chat);
  const students = useSelector(s => s.students);
  const user = useSelector(s => s.user);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (onSendMessage) {
      onSendMessage(message.trim());
    }
    
    setMessage("");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b bg-gray-50 p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "chat"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Chat ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "participants"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Participants ({students.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" && (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {msg.sender}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          msg.role === "teacher" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {msg.role}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{msg.text}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <div className="h-full overflow-y-auto p-4">
            {students.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No participants yet
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.socketId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">
                        {student.name}
                      </span>
                    </div>
                    {user.role === "teacher" && (
                      <button
                        onClick={() => {
                          // This would be handled by parent component
                          console.log("Remove student:", student.socketId);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}