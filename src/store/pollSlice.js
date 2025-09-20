// src/store/pollSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  question: null,
  options: [], // [{ text: string, count: number }]
  status: "idle", // 'idle' | 'active' | 'finished'
  timeLimit: 60,
  startedAt: null,
  answered: 0,
  totalStudents: 0,
  userAnswer: null, // Index of user's answer
  hasAnswered: false,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setPollStarted(state, action) {
      const { pollId, question, options, timeLimit } = action.payload;
      state.id = pollId;
      state.question = question;
      state.options = options.map((text) => ({ text, count: 0 }));
      state.status = "active";
      state.timeLimit = timeLimit || 60;
      state.startedAt = Date.now();
      state.answered = 0;
      state.totalStudents = 0;
      state.userAnswer = null;
      state.hasAnswered = false;
    },

    updatePoll(state, action) {
      const { counts, answered, totalStudents } = action.payload;
      if (counts) {
        state.options = state.options.map((opt, i) => ({
          ...opt,
          count: counts[i] || 0,
        }));
      }
      if (answered !== undefined) state.answered = answered;
      if (totalStudents !== undefined) state.totalStudents = totalStudents;
    },

    setPollResults(state, action) {
      const { finalCounts, options } = action.payload;
      if (finalCounts) {
        state.options = state.options.map((opt, i) => ({
          ...opt,
          count: finalCounts[i] || 0,
        }));
      }
      state.status = "finished";
    },

    setUserAnswer(state, action) {
      state.userAnswer = action.payload;
      state.hasAnswered = true;
    },

    resetPoll(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPollStarted,
  updatePoll,
  setPollResults,
  setUserAnswer,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;