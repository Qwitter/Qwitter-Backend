import prisma from '../client';
import { io } from '../socketServer';
import { EVENTS } from './socket';

export const sendNotification = (
  userName: string,
  notification: object,
): void => {
  io.to(userName).emit(EVENTS.SERVER.NOTIFICATION, notification);
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
