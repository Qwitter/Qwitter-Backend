import app from './app';
import swaggerDocs from './utils/swagger';
import http from 'http';
import { Request, Response } from 'express';
import { Server } from 'socket.io';
import socket from './utils/socket';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', credentials: true },
});

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
  swaggerDocs(app, PORT);
  console.log('server is running on port', PORT);
  socket({ io });
});
