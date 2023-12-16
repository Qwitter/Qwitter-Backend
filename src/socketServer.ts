import http from 'http';
import app from './app';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', credentials: true },
});
export { io, server };
