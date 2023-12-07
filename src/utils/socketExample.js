// This is an example of a simple sockets on the client side
// Developed by Qwitter Team to explain to the client side the process of connecting to the socket for real-time chat communication

// For each user when he opens the chat page a socket connection should be initiated
// The jwt token should be sent in the handshake query as token

// For each conversation, join the room Id with roomId = conversationId

// While the chat is open, the socket in the client should wait for a message event that indicates that a new message has been received

// To send a new message, just use the endpoint for sending a new message. No need for socket in the client here. The server will send the message to the socket

const io = require('socket.io-client');
const SOCKET_URL = 'http://qwitterback.cloudns.org:3000/';
const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
};
const socket = io(SOCKET_URL);
socket.emit('JOIN_ROOM', '133e0737-7671-4e03-a7f0-342f34effaf5');
socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
  console.log('Socket1: ' + message);
});

const socket2 = io(SOCKET_URL);
socket2.emit('JOIN_ROOM', '123');
socket2.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
  console.log('Socket2: ' + message);
});

const socket3 = io(SOCKET_URL);
socket3.emit('JOIN_ROOM', '456');
socket3.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
  console.log('Socket3: ' + message);
});

const socket4 = io(SOCKET_URL);
socket4.emit('JOIN_ROOM', '456');
socket4.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
  console.log('Socket4: ' + message);
});

// This will send a message to the room 123
socket2.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
  message: 'Hello world',
  username: 'ahmed',
  roomId: '123',
});
socket3.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
  message: 'Hello world',
  username: 'ahmed',
  roomId: '456',
});
