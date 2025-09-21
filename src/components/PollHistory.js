// src/pages/PollHistoryPage.js
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './PollHistory.css';

export default function PollHistoryPage() {
  const navigate = useNavigate();
  const pollHistory = useSelector(s => s.poll.history);
  console.log("Poll history:", pollHistory);
  console.log("History length:", pollHistory?.length);
  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <button 
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1>View Poll History</h1>
        </div>

        <div className="history-content">
          {pollHistory && pollHistory.length > 0 ? (
            pollHistory.map((historicalPoll, pollIndex) => (
              <div key={pollIndex} className="history-question">
                <h3>Question {pollIndex + 1}</h3>
                <div className="question-card">
                  <div className="question-header">{historicalPoll.question}</div>
                  <div className="options-results">
                    {historicalPoll.options.map((optionText, optIndex) => {
                      const votes = historicalPoll.votes[optionText] || 0;
                      const totalVotes = Object.values(historicalPoll.votes).reduce((sum, count) => sum + count, 0);
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={optIndex} className="option-result">
                          <div className="option-content">
                            <div className="option-circle">{optIndex + 1}</div>
                            <div className="option-name">{optionText}</div>
                          </div>
                          <div className="option-progress">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="option-percentage">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="poll-summary">
                    Total Votes: {Object.values(historicalPoll.votes).reduce((sum, count) => sum + count, 0)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-history">
              <h3>No Poll History</h3>
              <p>You haven't completed any polls yet.</p>
              <p>Complete some polls to see the history here.</p>
              <button 
                onClick={() => navigate('/teacher')} 
                className="primary-button"
              >
                Create First Poll
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}