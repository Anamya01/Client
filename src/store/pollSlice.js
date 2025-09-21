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
  history: [],
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
      
      // SAVE TO HISTORY
      if (state.question && state.options.length > 0) {
        state.history.push({
          question: state.question,
          options: state.options.map((opt) => opt.text),
          votes: Object.fromEntries(state.options.map((opt) => [opt.text, opt.count])),
          completedAt: new Date().toISOString(),
          totalVotes: state.options.reduce((sum, opt) => sum + opt.count, 0)
        });
      }
    },

    setUserAnswer(state, action) {
      state.userAnswer = action.payload;
      state.hasAnswered = true;
    },

    resetPoll(state) {
      Object.assign(state, {
        ...initialState,
        history: state.history
      });
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