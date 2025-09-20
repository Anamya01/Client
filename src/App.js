// src/App.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import socket from "./socket";
import { setSocketId } from "./store/userSlice";
import { 
  setPollStarted, 
  updatePoll, 
  setPollResults,
  resetPoll 
} from "./store/pollSlice";
import { 
  addStudent, 
  removeStudent, 
  setStudentLeft,
  clearStudents 
} from "./store/studentsSlice";
import { addMessage } from "./store/chatSlice";

import HomePage from "./pages/HomePage";
import JoinPage from "./pages/JoinPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import KickedPage from "./pages/KickedPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Socket connection events
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      dispatch(setSocketId(socket.id));
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      dispatch(setSocketId(null));
    });

    // Poll events
    socket.on("server:pollStarted", (data) => {
      console.log("Poll started:", data);
      dispatch(setPollStarted({
        pollId: data.pollId,
        question: data.question,
        options: data.options,
        timeLimit: data.timeLimit || 60,
      }));
      dispatch(clearStudents());
    });

    socket.on("server:pollUpdate", (data) => {
      console.log("Poll update:", data);
      dispatch(updatePoll({
        counts: data.counts,
        answered: data.answered,
        totalStudents: data.totalStudents,
      }));
    });

    socket.on("server:pollResults", (data) => {
      console.log("Poll results:", data);
      dispatch(setPollResults({ 
        finalCounts: data.finalCounts, 
        options: data.options 
      }));
    });

    // Student events
    socket.on("server:studentJoined", (data) => {
      console.log("Student joined:", data);
      dispatch(addStudent(data));
    });

    socket.on("server:studentRemoved", (data) => {
      console.log("Student removed:", data);
      dispatch(removeStudent(data.studentId));
    });

    socket.on("server:studentLeft", (data) => {
      console.log("Student left:", data);
      dispatch(setStudentLeft(data.socketId));
    });

    // Chat events
    socket.on("chat_message", (message) => {
      dispatch(addMessage(message));
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("server:pollStarted");
      socket.off("server:pollUpdate");
      socket.off("server:pollResults");
      socket.off("server:studentJoined");
      socket.off("server:studentRemoved");
      socket.off("server:studentLeft");
      socket.off("chat_message");
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/kicked" element={<KickedPage />} />
    </Routes>
  );
}

export default App;