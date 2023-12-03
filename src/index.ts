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
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*', credentials: true },
});
try {
  const socketPort = 5000;
  httpServer.listen(socketPort, () => {
    console.log(`Socket Running on port ${socketPort}...`);
    socket({ io });
  });
} catch (err) {
  console.log(err);
}
