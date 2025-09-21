// src/pages/TeacherPage.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import '../styles/TeacherPage.css';
import FloatingChat from "../components/FloatingChat";

export default function TeacherPage() {
  const navigate = useNavigate();
  
  const user = useSelector(s => s.user);
  const poll = useSelector(s => s.poll);
  
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!user.name || user.role !== "teacher") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (poll.status === "idle") {
      setShowCreateForm(true);
    } else {
      setShowCreateForm(false);
    }
  }, [poll.status]);

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

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const createPoll = (e) => {
    e.preventDefault();
    
    const validOptions = options.filter(o => o.text.trim()).map(o => o.text.trim());
    
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }
    
    if (validOptions.length < 2) {
      setError("Please provide at least two options");
      return;
    }

    setLoading(true);
    setError("");

    socket.emit("teacher:createPoll", {
      question: question.trim(),
      options: validOptions,
      timeLimit: timeLimit
    }, (response) => {
      setLoading(false);
      
      if (response && response.status === "error") {
        setError(response.message);
      } else {
        setQuestion("");
        setOptions([
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ]);
        setTimeLimit(60);
        setShowCreateForm(false);
      }
    });
  };
  if (!user.name) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="teacher-page-new">
      <div className="main-container">
        {/* Create Poll Form */}
        {showCreateForm && (
          <div className="poll-form-container">
            <div className="form-header">
              <h1 className="main-title">Let's Get Started</h1>
              <p className="subtitle">
                You'll have the ability to create and manage polls, ask questions, and monitor 
                your students' responses in real-time.
              </p>
            </div>

            <form onSubmit={createPoll} className="poll-form">
              <div className="form-top">
                <div className="question-section">
                  <label className="form-label">Enter your question</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="question-input"
                    placeholder="Type your question here..."
                    disabled={loading}
                    maxLength={100}
                  />
                  <div className="char-count">{question.length}/100</div>
                </div>

                <div className="timer-section">
                  <select 
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    className="timer-select"
                    disabled={loading}
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={90}>90 seconds</option>
                    <option value={120}>2 minutes</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              </div>

              <div className="form-bottom">
                <div className="options-section">
                  <h3 className="section-title">Edit Options</h3>
                  {options.map((option, index) => (
                    <div key={index} className="option-row">
                      <div className="option-number">{index + 1}</div>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                        className="option-input"
                        placeholder="Enter option"
                        disabled={loading}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="remove-option"
                          disabled={loading}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addOption}
                    className="add-option"
                    disabled={loading}
                  >
                    + Add More option
                  </button>
                </div>

                <div className="correct-section">
                  <h3 className="section-title">Is it Correct?</h3>
                  {options.map((option, index) => (
                    <div key={index} className="correct-row">
                      <label className="radio-group">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={option.isCorrect}
                          onChange={(e) => updateOption(index, 'isCorrect', true)}
                          disabled={loading}
                        />
                        <span className="radio-button"></span>
                        <span className="radio-label">Yes</span>
                      </label>
                      <label className="radio-group">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={!option.isCorrect}
                          onChange={(e) => updateOption(index, 'isCorrect', false)}
                          disabled={loading}
                        />
                        <span className="radio-button"></span>
                        <span className="radio-label">No</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-button large"
                >
                  {loading ? "Creating..." : "Ask Question"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results Display - Active or Finished */}
        {((poll.status === "active" || poll.status === "finished") && !showCreateForm) && (
          <div className="results-view">
             <div className="question-headers">Question</div>
            <div className="question-card">
              <div className="question-text">{poll.question}</div>
              
              <div className="options-results">
                {poll.options.map((option, index) => {
                  const total = poll.options.reduce((sum, opt) => sum + opt.count, 0);
                  const percentage = total > 0 ? Math.round((option.count / total) * 100) : 0;
                  
                  return (
                    <div key={index} className="option-result">
                      <div className="option-content">
                        <div className="option-circle">{index + 1}</div>
                        <div className="option-name">{option.text}</div>
                      </div>
                      <div className="option-progress">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      {poll.status === "finished" && (
                        <div className="option-percentage">{percentage}%</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {poll.status === "finished" && (
              <div className="action-section">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="primary-button large"
                >
                  + Ask a new question
                </button>
              </div>
            )}
          </div>
        )}

        {/* Poll History Modal */}
      </div>
      <FloatingChat/>
    </div>
  );
}