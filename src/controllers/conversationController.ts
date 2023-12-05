import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { AppError } from '../utils/appError';
import { User } from '@prisma/client';
import {
  createMessage,
  searchMember,
  searchMemberForNewConversation,
  validMessageReply,
  
} from '../repositories/conversationRepository';
import { getMessageEntities } from '../repositories/entityRepository';
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
export const searchForMembersForNewConversation = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    //search
    const { q, page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;
    const users = await searchMemberForNewConversation(
      (q as string).trim(),
      skip,
      parsedLimit,
      req.user as User,
    );
    res.status(200).json({ users: users });
    return _next();
  },
);

export const postMessage = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const user = req.user as User;
    // Check if there is media
    const photoName = req.file?.filename;

    // Check that if there is a reply that the reply is valid

    if (req.body.replyId) {
      const valid = await validMessageReply(id, req.body.replyId);
      if (!valid) {
        return res.status(400).json({ message: 'Invalid reply Id' });
      }
    }
    // Create the message
    const createdMessage = await createMessage(
      req.body.text,
      user.id,
      id,
      req.body.replyId,
      photoName,
    );
    // Send the message to the socket
    return res.status(201).json({
      createdMessage,
    });
  },
);

export const createConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = req.body.users as Array<string>;
    let usersIDs = [];
    const authUser = req.user as User;
    let newConv;
    for (var user of users) {
      let tempUser = await prisma.user.findUnique({
        where: { userName: user.toLowerCase(), deletedAt: null },
        select: { id: true, name: true },
      });
      if (!tempUser) return next(new AppError('not all users are found', 401));
      if (tempUser.id == authUser.id)
        return next(
          new AppError("can't create conversation with yourself", 402),
        );
      usersIDs.push(tempUser);
    }
    if(users.length==0)
      new AppError("no users provided", 403)

    if (users.length == 1) {
      let tempConv = await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              isGroup: false,
              UserConversations: {
                some: {
                  userId: usersIDs[0].id,
                },
              },
            },
            {
              isGroup: false,
              UserConversations: {
                some: {
                  userId: authUser.id,
                },
              },
            },
          ],
        },
      });
      if (tempConv)
        return next(new AppError('Conversation already exists', 404));
      newConv = await prisma.conversation.create({
        data: {
          name: authUser.name + ', ' + usersIDs[0].name,
          isGroup: false,
          lastActivity: new Date(),
          UserConversations: {
            create: [
              { userId: authUser.id, seen: true },
              { userId: usersIDs[0].id, seen: false },
            ],
          },
        },
      });
    } else {
      newConv = await prisma.conversation.create({
        data: {
          name: req.body.conversation_name,
          lastActivity: new Date(),
          isGroup: true,
          UserConversations: {
            create: [{ userId: authUser.id, seen: true }],
          },
        },
      });
      for (var tempUser of usersIDs)
        await prisma.userConversations.create({
          data: {
            conversationId: newConv.id,
            userId: tempUser.id,
            seen: false,
          },
        });
    }
    res.json(newConv).status(200);
    next();
  },
);

export const deleteConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user as User;
    const conv = await prisma.conversation.findUnique({
      where: {
        id: req.params.id,
        UserConversations: {
          some: {
            userId: authUser.id,
          },
        },
      },
    });
    if (!conv) return next(new AppError('conversation not found', 401));

    const deletedConv = await prisma.userConversations.delete({
      where: {
        userId_conversationId: { userId: authUser.id, conversationId: conv.id },
      },
    });
    if (deletedConv) res.json({ operationSuccess: true }).status(200);
    else res.json({ operationSuccess: false }).status(404);
    next();
  },
);

export const getConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user as User;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;
    let convs = await prisma.conversation.findMany({
      where: {
        UserConversations: {
          some: {
            userId: authUser.id,
          },
        },
      },
      select: {
        id: true,
        photo:true,
        UserConversations:{
          select:{
            seen:true,
            User:{
              select:{
                name:true,
                userName:true,
                profileImageUrl:true
              }
              
            }
          }
        },
        Message: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
          
          select: {
            id: true,
            text: true,
            date: true,
            
            sender: {
              select: {
                userName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        name: true,
        lastActivity: true,
        isGroup:true
        
        
      },
      orderBy: {
        lastActivity: 'desc',
      },
      skip: skip,
      take: parsedLimit,
    });
    let responseConvs=[]

    for(var tempConv of convs)
    {
      let entities;
      let lastMessage={}
      if(tempConv.Message.length!=0)
      {
        entities=await getMessageEntities(tempConv.Message[0].id)
        lastMessage={
          status:tempConv.UserConversations[0].seen,
          id:tempConv.Message[0].id,
          date:tempConv.Message[0].date,
          text:tempConv.Message[0].text,
          reply:{},
          userName:tempConv.Message[0].sender.userName,
          profileImageUrl:tempConv.Message[0].sender.profileImageUrl,
          entities:entities
        }
      }
      
      let tempResponse={
        id:tempConv.id,
        name:tempConv.name,
        lastMessage:lastMessage,
        photo:tempConv.photo,
        isGroup:tempConv.isGroup,
        users:tempConv.UserConversations
      };
      responseConvs.push(tempResponse)
    }
    res.json(responseConvs).status(200);
    next();
  },
);
