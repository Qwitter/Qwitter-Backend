import app from './app';
import { Server, Socket } from 'socket.io';
// import swaggerDocs from './utils/swagger';
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import socket from './utils/socket';

// const port: number = 3000;
// app.listen(port, () => {
//   swaggerDocs(app, port);
//   console.log(`App running on port ${port}...`);
// });

// // Socket.io for chatting
// const httpServer = createServer();
// const io = new Server(httpServer, {
//   cors: { origin: '*', credentials: true },
// });
// try {
//   const socketPort = 5555;
//   httpServer.listen(socketPort, () => {
//     console.log(`Socket Running on port ${socketPort}...`);
//     socket({ io });
//   });
// } catch (err) {
//   console.log(err);
// }
// App setup
const PORT = 5000;
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// Static files

// Socket setup
const io = new Server(server);

io.on('connection', (_socket: Socket) => {
  console.log('Made socket connection');
});
