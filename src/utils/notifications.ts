import { io } from '../index';
import { EVENTS } from './socket';

export const sendNotification = (userName: string, notification: object) => {
  io.to(userName).emit(EVENTS.SERVER.NOTIFICATION, notification);
};
export const sendMessage = (
  conversationId: string,
  //   userName: string,
  message: any,
) => {
  io.to(conversationId).emit(EVENTS.SERVER.NOTIFICATION, message);

  // Should send to all the users in the conversation except the sender

  //   io.to(userName).emit(EVENTS.SERVER.MESSAGE, {
  //     ...message,
  //     conversationId,
  //   });
};
