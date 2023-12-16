import http from 'http';
import { Server } from 'socket.io';
import express from 'express';

const expressApp = express();
const server = http.createServer(expressApp);
const io = new Server(server, {
  cors: { origin: '*', credentials: true },
});

export { io, server };
