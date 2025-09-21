import { io } from "socket.io-client";

const socket = io("https://polling-1eti.onrender.com"); // backend url
export default socket;
