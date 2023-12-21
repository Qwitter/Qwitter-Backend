// import { conversation } from './../types/conversations';
import { User } from '@prisma/client';
// import { Message } from '../types/conversations';
import { Server, Socket } from 'socket.io';
import { io } from '../socketServer';

export const EVENTS = {
  connection: 'connection',
  CLIENT: {
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE', // Used for sending a message
    JOIN_ROOM: 'JOIN_ROOM', // Joiniing a room. It can be used by joining  a conversation room or a userName room for notifications.
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM', // Sending a message that a user joined a room
    ROOM_MESSAGE: 'ROOM_MESSAGE', // Sending a message to the conversation room socket only
    NOTIFICATION: 'NOTIFICATION', // Sending a message to the room of the username
    MESSAGE: 'MESSAGE', // Sending a general message to the user on the room of the username
    CONVERSATION: 'CONVERSATION', //Socket for
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
    console.log('Hamada connected');
    try {
      socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, (message) => {
        let JSONMessage = message;
        // This check is necessary because sometimes the data comes different from the clients (mobile , web)
        // It makes sure that the data in the end is parsed JSON
        if (isValidJsonString(message)) {
          JSONMessage = JSON.parse(message);
        }
        socket
          .to(JSONMessage.conversationId)
          .emit(EVENTS.SERVER.ROOM_MESSAGE, JSONMessage.data);
      });
      socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
        socket.join(roomId);
      });
      // This is for the client side to calculate the time taken to connect to the socket
      socket.on('ping', (callback) => {
        callback();
      });
    } catch (err) {
      console.log(err);
    }
  });
}
export function runSocket() {
  socket({ io });
}

export default socket;

function isValidJsonString(str: any) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}
