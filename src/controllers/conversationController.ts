import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { User } from '@prisma/client';
import { searchMember } from '../repositories/conversationRepository';
// export const sendMessage = (req: Request, res: Response) => {};

export const editConversationName = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const conversationId = req.params.id;
    if (!conversationId)
      return res.json({ message: 'Bad Request' }).status(400);
    //check if user is in the conversation
    const found = await prisma.userConversations.findFirst({
      where: {
        userId: (req.user as User).id,
        conversationId: conversationId,
        Conversation: { isGroup: true },
      },
    });
    if (!found) return res.status(400).json({ message: 'Bad Request' });

    //update
    const newConversationName = req.body.name;
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        name: newConversationName,
      },
    });
    if (!updatedConversation)
      return res.status(404).json({ message: 'Not Found' });

    res.status(200).json({ status: 'success', id: conversationId });
    return _next();
  },
);

export const getConversationDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { conversationId } = req.params;

  const isUserInGroup = await prisma.userConversations.findFirst({
    where: {
      userId: ((req.user) as User).id,
      conversationId,
    },
  });

  if (!isUserInGroup) {
    res.status(403).json({
      status: 'error',
      message: 'User is not a member of the group.',
    });
    return;
  }

  const { page = '1', limit = '10' } = req.query;
  const parsedPage = parseInt(page as string, 10);
  const parsedLimit = parseInt(limit as string, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  await prisma.userConversations.updateMany({
    where: {
      conversationId,
      userId: (req.user as User).id,
    },
    data: {
      seen: true,
    },
  });

  const conversationDetails = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      Message: {
        skip,
        take: parsedLimit,    
        orderBy: {
          date: 'asc',
        },
        include: {
          sender: true,
          messageEntity: {
            select: {
              entity: {
                include: {
                  Url: true,
                  Media: true,
                  Mention: true,
                  Hashtag: true,
                }
              }
            },
          },
        },
      },
      UserConversations: {
        include: {
          User: true,
        },
      },
      //isGroup: true,
    },
  });

  const formattedMessages = conversationDetails?.Message.map((message) => ({
    id: message.id,
    date: message.date.toISOString(),
    userName: message.sender.userName,
    userPhoto: message.sender.profileImageUrl,
    media: {
      url: message.messageEntity[0] ? message.messageEntity[0].entity.type : null,
      type: message.messageEntity[0] ? message.messageEntity[0].entity.Url?.text : null,
      Url: message.messageEntity[0].entity.Url,
      Media: message.messageEntity[0].entity.Media,
      Mention: message.messageEntity[0].entity.Mention,
      Hashtag: message.messageEntity[0].entity.Hashtag,
    },
  }));

  const formattedUsers = conversationDetails?.UserConversations.map((userConversation) => ({
    userName: userConversation.User.userName,
    userPhoto: userConversation.User.profileImageUrl,
  }));

  const formattedConversationDetails = {
    messages: formattedMessages,
    name: conversationDetails?.name,
    //type: conversationDetails?.isGroup ? 'group' : 'direct',
    users: formattedUsers,
  };

  res.status(200).json(formattedConversationDetails);
  next();
};
export const searchForMembers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const conversationId = req.params.id;
    if (!conversationId)
      return res.json({ message: 'Bad Request' }).status(400);
    //check if user is in the conversation
    const found = await prisma.userConversations.findFirst({
      where: {
        userId: (req.user as User).id,
        conversationId: conversationId,
        Conversation: { isGroup: true },
      },
    });
    if (!found) return res.status(400).json({ message: 'Bad Request' });

    //search
    const { q, page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;
    const users = await searchMember(
      (q as string).trim(),
      skip,
      parsedLimit,
      conversationId,
      req.user as User,
    );

    res.status(200).json({ users: users });
    return _next();
  },
);
