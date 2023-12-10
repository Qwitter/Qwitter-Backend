import app from './app';
import swaggerDocs from './utils/swagger';
import http from 'http';
import { Server } from 'socket.io';
import socket from './utils/socket';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', credentials: true },
});

const PORT = 3000;
server.listen(PORT, () => {
  swaggerDocs(app, PORT);
  console.log('server is running on port', PORT);
  socket({ io });
});

// Exporting the socket to be used for utils like notifications
export { io };
