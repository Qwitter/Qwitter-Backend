import app from './app';
import swaggerDocs from './utils/swagger';
import socket from './utils/socket';
import { io, server } from './socketServer';
// Server part
const port: number = 3000;
console.log(app);
app.listen(port, () => {
  swaggerDocs(app, port);
  console.log(`App running on port ${port}...`);
});

// Socket part

const socketPort: number = 3000;
server.listen(socketPort, () => {
  console.log('socket is running on port', socketPort);
  socket({ io });
});

// Exporting the socket to be used for utils like notifications
