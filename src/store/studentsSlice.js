// src/store/studentsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const studentsSlice = createSlice({
  name: "students",
  initialState: [], // [{ socketId, name }]
  reducers: {
    addStudent(state, action) {
      const { socketId, name } = action.payload;
      // Check if student already exists
      const existingIndex = state.findIndex(s => s.socketId === socketId);
      if (existingIndex >= 0) {
        // Update existing student
        state[existingIndex] = { socketId, name };
      } else {
        // Add new student
        state.push({ socketId, name });
      }
    },

    removeStudent(state, action) {
      const socketId = action.payload;
      return state.filter(s => s.socketId !== socketId);
    },

    setStudentLeft(state, action) {
      const socketId = action.payload;
      // Mark as left or remove entirely
      return state.filter(s => s.socketId !== socketId);
    },

    setStudents(state, action) {
      return action.payload;
    },

    clearStudents() {
      return [];
    },
  },
});

export const { 
  addStudent, 
  removeStudent, 
  setStudentLeft, 
  setStudents, 
  clearStudents 
} = studentsSlice.actions;

export default studentsSlice.reducer;