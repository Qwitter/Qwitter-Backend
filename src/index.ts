import app from './app';
// // import swaggerDocs from './utils/swagger';
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import socket from './utils/socket';

// // const port: number = 3000;
// // app.listen(port, () => {
// //   swaggerDocs(app, port);
// //   console.log(`App running on port ${port}...`);
// // });

// // Socket.io for chatting
// const httpServer = createServer(app);
// const io = new Server(httpServer);
// try {
//   const socketPort = 5000;
//   httpServer.listen(socketPort, () => {
//     console.log(`Socket Running on port ${socketPort}...`);
//     socket({ io });
//   });
// } catch (err) {
//   console.log(err);
// }
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/messages', (_req: Request, res: Response) => {
  res.send('ffsd');
});

app.post('/messages', (req: Request, res: Response) => {
  console.log(req.body);
  io.emit('message', req.body);
  res.sendStatus(200);
});

io.on('connection', () => {
  console.log('a user is connected');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
