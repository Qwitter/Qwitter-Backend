import app from './app';
import swaggerDocs from './utils/swagger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socket from './utils/socket';

const port: number = 3000;
app.listen(port, () => {
  swaggerDocs(app, port);
  console.log(`App running on port ${port}...`);
});

// Socket.io for chatting
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', credentials: true },
});
const host = process.env.HOST;
const socketPort = Number(process.env.SOCKET_PORT) || 8080;
httpServer.listen(socketPort, host, () => {
  console.log(`Socket Running on port ${socketPort}...`);
  socket({ io });
});
