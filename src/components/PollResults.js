// src/components/PollResults.js
import React from "react";
import { useSelector } from "react-redux";

const PollResults = () => {
  const currentPoll = useSelector((state) => state.polls.currentPoll);
  const votes = useSelector((state) => state.polls.votes);

  if (!currentPoll) {
    return <h3>No active poll</h3>;
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-2">Live Results</h2>
      {currentPoll.options.map((option, idx) => {
        const count = votes[option] || 0;
        const percentage =
          totalVotes === 0 ? 0 : ((count / totalVotes) * 100).toFixed(1);
        return (
          <div key={idx} className="mb-2">
            <span className="font-medium">{option}</span>
            <div className="w-full bg-gray-300 h-4 rounded mt-1">
              <div
                className="bg-blue-500 h-4 rounded"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {count} votes ({percentage}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PollResults;
