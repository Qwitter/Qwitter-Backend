import socket from './utils/socket';
import { io, server } from './socketServer';

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log('Qwitter is running on port', PORT);
  socket({ io });
});

// Exporting the socket to be used for utils like notifications
