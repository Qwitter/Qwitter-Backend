import { User } from '@prisma/client';
// import { Message } from '../types/conversations';
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
    NOTIFICATION: 'NOTIFICATION',
  },
};
interface CustomSocket extends Socket {
  user: User;
}
export function sendRoomMessage(
  socket: CustomSocket,
  roomId: string,
  message: any,
) {
  socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
    message,
  });
}

function socket({ io }: { io: Server }) {
  io.on(EVENTS.connection, (socket: CustomSocket) => {
    console.log('User connected ' + socket.id);
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, (message) => {
      sendRoomMessage(socket, message.conversationId, message.data);
      console.log('Received room message');
      console.log(message);
    });
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      console.log('User joined room ' + roomId);
      socket.join(roomId);
    });
  });
}

export default socket;
