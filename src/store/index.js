import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import pollReducer from "./pollSlice";
import studentsReducer from "./studentsSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    poll: pollReducer,
    students: studentsReducer,
    chat: chatReducer,
  },
});

export default store;
