// src/components/PollForm.js
import React, { useState } from "react";
import socket from "../socket";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [loading, setLoading] = useState(false);

  const updateOption = (i, value) => {
    const arr = [...options]; arr[i] = value; setOptions(arr);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i) => setOptions(options.filter((_, idx) => idx !== i));

  const handleCreate = () => {
    const validOptions = options.map(o => o.trim()).filter(o => o);
    if (!question.trim() || validOptions.length < 2) {
      return alert("Enter question and at least two options");
    }
    setLoading(true);
    socket.emit("teacher:createPoll", { question, options: validOptions, timeLimit }, (ack) => {
      setLoading(false);
      if (!ack) return;
      if (ack.status === "error") alert("Error: " + ack.message);
      else {
        // server will broadcast server:pollStarted which App listens to
        setQuestion("");
        setOptions(["", ""]);
      }
    });
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div>
        <label>Question</label>
        <input value={question} onChange={e => setQuestion(e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Options</label>
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", marginTop: 6 }}>
            <input value={opt} onChange={(e) => updateOption(i, e.target.value)} style={{ flex: 1 }} />
            {options.length > 2 && <button onClick={() => removeOption(i)}>x</button>}
          </div>
        ))}
        <button onClick={addOption} style={{ marginTop: 8 }}>Add option</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Time limit (seconds)</label>
        <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleCreate} disabled={loading}>{loading ? "Creating..." : "Create Poll"}</button>
      </div>
    </div>
  );
}
