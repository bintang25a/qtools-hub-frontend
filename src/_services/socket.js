import { io } from "socket.io-client";
import { baseURL } from "../_api";

const socket = io(baseURL, {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
