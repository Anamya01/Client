import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/HistoryPage.css";

export default function HistoryPage() {
  const history = useSelector((s) => s.poll.history);
  const navigate = useNavigate();

  if (!history || history.length === 0) {
    return (
      <div className="history-container empty-history">
        <h2>No polls have been completed yet.</h2>
        <button onClick={() => navigate(-1)} className="primary-button">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1 className="history-title">View <span>Poll History</span></h1>

      {history.map((poll, index) => {
        const totalVotes = Object.values(poll.votes).reduce(
          (sum, v) => sum + v,
          0
        );

        return (
        <div>
          <h2 className="poll-headers">Question {index + 1}</h2>
          <div key={index} className="poll-cards">
            <div className="poll-questions">{poll.question}</div>

            <div className="poll-optionss">
              {poll.options.map((opt, i) => {
                const votes = poll.votes[opt] || 0;
                const percentage = totalVotes
                  ? Math.round((votes / totalVotes) * 100)
                  : 0;

                return (
                    <div key={index} className="option-result">
                    <div className="option-content">
                      <div className="option-circle">{index + 1}</div>
                      <div className="option-name">{opt}</div>
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
          </div>
          
        );
      })}

      <button onClick={() => navigate(-1)} className="primary-button">
        ← Back
      </button>
    </div>
  );
}
