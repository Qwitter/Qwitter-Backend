import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
};
interface CustomSocket extends Socket {
  user: User;
}
const rooms: Record<string, { name: string }> = {};

export function sendRoomMessage(
  socket: CustomSocket,
  roomId: string,
  message: string,
  username: string,
) {
  const date = new Date();
  console.log(message, username);
  socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
    message,
    username,
    time: `${date.getHours()}:${date.getMinutes()}`,
  });
}

function socket({ io }: { io: Server }) {
  io.use((_socket, next) => {
    // Extract token from query parameters
    // const token = socket.handshake.query.token;

    // if (!token) {
    //   return next(new Error('Authentication error: Token not provided'));
    // }

    next();

    // jwt.verify(token, secretKey, (err, decoded) => {
    //   if (err) {
    //     return next(new Error('Authentication error: Invalid token'));
    //   }

    //   // Attach user information to the socket
    //   socket.user = decoded.user;
    //   next();
    // });

    // TODO: Here should be added authentication layer using jwt
  });

  io.on(EVENTS.connection, (socket: CustomSocket) => {
    console.log('User connected ' + socket.id);
    const headers = socket.handshake.headers;
    console.log(headers);
    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * When a user sends a room message
     */

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        sendRoomMessage(socket, roomId, message, username);
      },
    );

    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      //TODO: Check here that the user who wants to join is already in that conversation
      // if (!socket.user) {
      //   console.log('unable to join. Please log in first');
      // }
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
