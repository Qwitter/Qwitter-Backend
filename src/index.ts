import { runSocket } from './utils/socket';
import { server } from './socketServer';
import { io } from './socketServer';

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log('Qwitter is running on port', PORT);
  runSocket();
});

export { io };
// Exporting the socket to be used for utils like notifications
