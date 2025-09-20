// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  role: "", // 'teacher' or 'student'
  socketId: null,
  isJoined: false, // Track if student has joined a poll
  joinError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { name, role } = action.payload;
      state.name = name;
      state.role = role;
      state.isJoined = false;
      state.joinError = null;
    },
    setSocketId(state, action) {
      state.socketId = action.payload;
    },
    setJoinStatus(state, action) {
      state.isJoined = action.payload.isJoined;
      state.joinError = action.payload.error || null;
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { 
  setUser, 
  setSocketId, 
  setJoinStatus, 
  clearUser 
} = userSlice.actions;

export default userSlice.reducer;