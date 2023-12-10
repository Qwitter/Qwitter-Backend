// import { conversation } from './../types/conversations';
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
    try {
      console.log(socket.id + ' connected');
      socket.emit('notification', {
        text: 'Notification test',
        data: 'Notification data',
      });

      socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, (message) => {
        console.log('Message TEXT: ' + message?.data?.text);
        console.log('Received Message: ' + message);
        console.log(typeof message);
        console.log(message.conversationId);
        let JSONMessage = JSON.parse(message);
        console.log(JSONMessage);
        socket
          .to(message.conversationId)
          .emit(EVENTS.SERVER.ROOM_MESSAGE, message.data);
        socket
          .to(JSONMessage.conversationId)
          .emit(EVENTS.SERVER.ROOM_MESSAGE, JSONMessage.data);
      });
      socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
        console.log(socket.id + ' Joined Room: ' + roomId);
        socket.join(roomId);
      });
      socket.on('ping', (callback) => {
        callback();
      });
    } catch (err) {
      console.log(err);
    }
  });
}

export default socket;
