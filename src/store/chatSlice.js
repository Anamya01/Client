// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: [], // [{ sender, role, text, timestamp }]
  reducers: {
    addMessage(state, action) {
      state.push(action.payload);
    },
    clearChat() {
      return [];
    },
  },
});

export const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
