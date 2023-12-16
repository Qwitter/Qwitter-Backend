import app from './app';
import swaggerDocs from './utils/swagger';
import http from 'http';
import { Server } from 'socket.io';
import socket from './utils/socket';
import express from 'express';

// Server part
const port: number = 3000;
app.listen(port, () => {
  swaggerDocs(app, port);
  console.log(`App running on port ${port}...`);
});

// Socket part
const expressApp = express();
const server = http.createServer(expressApp);
const io = new Server(server, {
  cors: { origin: '*', credentials: true },
});

const socketPort: number = 1982;
server.listen(socketPort, () => {
  console.log('socket is running on port', socketPort);
  socket({ io });
});

// Exporting the socket to be used for utils like notifications
export { io };
