import { User } from '@prisma/client';
import prisma from '../client';
import { io } from '../socketServer';
import { EVENTS } from './socket';
import { incrementNotification } from '../controllers/notificationController';

export const sendNotification = (user: User, notification: object): void => {
  io.to(user.userName).emit(EVENTS.SERVER.NOTIFICATION, notification);
  io.to(user.userName).emit(
    EVENTS.SERVER.NOTIFICATION_COUNT,
    user.notificationCount ? user.notificationCount + 1 : 1,
  );
  incrementNotification(user.userName);
};

// Sends update to all the people in the conversation in the page of the conversations
export const sendConversationUpdate = async (
  lastMessage: any,
  conversationId: string,
) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
    },
    include: {
      UserConversations: {
        select: {
          User: {
            select: {
              userName: true,
            },
          },
        },
      },
    },
  });
  if (conversation) {
    for (const user of conversation.UserConversations) {
      const currentUsername = user.User.userName;
      io.to(currentUsername).emit(EVENTS.SERVER.CONVERSATION, {
        ...conversation,
        lastMessage,
      });
    }
  }
};
