import socket from './utils/socket';
import { io, server } from './socketServer';

const PORT = 3000;
server.listen(PORT, () => {
  console.log('server is running on port', PORT);
  socket({ io });
});

// Exporting the socket to be used for utils like notifications
