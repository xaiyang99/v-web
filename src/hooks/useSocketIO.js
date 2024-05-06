import { io } from "socket.io-client";
import { linkSocketIO } from "../functions";

export const SocketServer = () => {
  const socketIO = io(linkSocketIO, {
    connectimeout: 1000,
    reconnection: true,
    reconnectionDelay: 300,
    reconnectionAttempts: Infinity,
    forcenewconnect: true,
  });

  return socketIO;
};
