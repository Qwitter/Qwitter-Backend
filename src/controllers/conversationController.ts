import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { AppError } from '../utils/appError';
import { User } from '@prisma/client';
import {
  addPeopleToConversation,
  createMessage,
  searchMember,
  searchMemberForNewConversation,
  validMessageReply,
  findConversationPeople,
  findConversationById,
  resetSeenConversation,
  incrementSeenConversation,
  isConversationSeen,
} from '../repositories/conversationRepository';
import {
  getImagePath,
  getMessageEntities,
} from '../repositories/entityRepository';
import {
  isUserFollowing,
  isUserBlocked,
  isUserMuted,
  getUserByID,
} from '../repositories/userRepository';
import { sendConversationUpdate } from '../utils/notifications';

// export const sendMessage = (req: Request, res: Response) => {};

export const editConversation = catchAsync(
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
    // Updating the conversation photo
    let photoName = req.file?.filename;
    if (photoName) photoName = getImagePath(photoName, 'message');

    //update
    const newConversationName = req.body.name;
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        name: newConversationName,
        photo: photoName,
      },
    });

    if (!updatedConversation)
      return res.status(404).json({ message: 'Not Found' });

    return res.status(200).json({ status: 'success', id: conversationId });
  },
);

export const getConversationDetails = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const conversationId = id;
    const authUser = req.user as User;
    const isUserInGroup = await prisma.userConversations.findFirst({
      where: {
        userId: authUser.id,
        conversationId,
      },
    });

    if (!isUserInGroup) {
      res.status(401).json({
        status: 'error',
        message: 'User is not a member of the group.',
      });
      return;
    }

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10)
      ? parseInt(page as string, 10)
      : 1;
    const parsedLimit = parseInt(limit as string, 10)
      ? parseInt(limit as string, 10)
      : 10;
    const skip = (parsedPage - 1) * parsedLimit;

    await prisma.userConversations.updateMany({
      where: {
        conversationId,
        userId: authUser.id,
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
            date: 'desc',
          },
          include: {
            sender: true,
            reply: {
              select: {
                id: true,
                text: true,
                date: true,
                sender: true,
                conversationId: true,
                isMessage: true,
                replyToMessageId: true,
              },
            },
            messageEntity: {
              select: {
                entity: {
                  include: {
                    Url: true,
                    Media: true,
                    Mention: true,
                    Hashtag: true,
                  },
                },
              },
            },
          },
          where: {
            deletedAt: null,
          },
        },
        UserConversations: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
                userName: true,
                profileImageUrl: true,
                description: true,
                followersCount: true,
                followingCount: true,
              },
            },
            dateJoined: true,
          },
        },
      },
    });

    let isBlocked = false;
    let isBlocker = false;

    if (!conversationDetails?.isGroup) {
      let i = 0;
      if (conversationDetails?.UserConversations[i].User.id == authUser.id) {
        i++;
      }
      isBlocked = await isUserBlocked(
        authUser.id,
        conversationDetails?.UserConversations[i].User.id as string,
      );
      isBlocker = await isUserBlocked(
        conversationDetails?.UserConversations[i].User.id as string,
        authUser.id,
      );
    }

    const formattedMessages = await Promise.all(
      (conversationDetails?.Message || []).map(async (message) => ({
        id: message.id,
        date: message.date.toISOString(),
        text: message.text,
        replyToMessage: message.reply
          ? {
              conversationId: message.reply?.conversationId,
              date: message.reply?.date,
              id: message.reply?.id,
              isMessage: message.reply?.isMessage,
              replyToMessageId: message.reply?.replyToMessageId,
              text: message.reply?.text,
              userName: message.reply?.sender.userName,
            }
          : null,
        userName: message.sender.userName,
        profileImageUrl: message.sender.profileImageUrl,
        entities: await getMessageEntities(message.id),
        isMessage: message.isMessage,
      })),
    );
    let lastActivity = formattedMessages[0].date;
    const users = [];
    if (conversationDetails)
      for (let i = 0; i < conversationDetails.UserConversations.length; i++)
        if (
          conversationDetails.UserConversations[i].User.userName !=
          authUser.userName
        ) {
          const isFollowing = await isUserFollowing(
            authUser.id,
            conversationDetails.UserConversations[i].User.id,
          );
          const isFollowed = await isUserFollowing(
            conversationDetails.UserConversations[i].User.id,
            authUser.id,
          );
          const isBlocked = await isUserBlocked(
            authUser.id,
            conversationDetails.UserConversations[i].User.id,
          );
          const isMuted = await isUserMuted(
            authUser.id,
            conversationDetails.UserConversations[i].User.id,
          );
          const user = {
            name: conversationDetails.UserConversations[i].User.name,
            userName: conversationDetails.UserConversations[i].User.userName,
            description:
              conversationDetails.UserConversations[i].User.description,
            followersCount:
              conversationDetails.UserConversations[i].User.followersCount,
            followingCount:
              conversationDetails.UserConversations[i].User.followingCount,
            profileImageUrl:
              conversationDetails.UserConversations[i].User.profileImageUrl,
          };
          users.push({
            ...user,
            isFollowing: isFollowing,
            isFollowed: isFollowed,
            isBlocked: isBlocked,
            isMuted: isMuted,
          });
        }
    let newName, newFullName;
    if (conversationDetails?.name) {
      newName = conversationDetails.name;
      newFullName = conversationDetails.name;
    } else {
      newName =
        users
          .slice(0, 3)
          .map((user) => user.name)
          .join(', ') +
        `${users.length - 3 > 0 ? ` and ${users.length - 3}Â more` : ''}`;
      newFullName = users.map((user) => user.name).join(', ');
    }

    const formattedConversationDetails = {
      id: conversationDetails?.id,
      messages: formattedMessages,
      name: newName,
      fullName: newFullName,
      isGroup: conversationDetails?.isGroup,
      photo: conversationDetails?.photo,
      users: users,
      dateJoined: conversationDetails?.isGroup
        ? conversationDetails?.UserConversations.find(
            (u) => u.User.userName == (req.user as User).userName,
          )?.dateJoined
        : '',
      lastActivity: lastActivity,
      seen: true,
      blocked: isBlocked || isBlocker,
    };

    return res.status(200).json(formattedConversationDetails);
  },
);
export const searchForMembers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const conversationId = req.params.id;
    // if (!conversationId)
    //   return res.json({ message: 'Bad Request' }).status(400);
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

    return res.status(200).json({ users: users });
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
    return res.status(200).json({ users: users });
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
    sendConversationUpdate(createMessage, id);

    // Incrementing the count of unseen conversations for users in the conversation
    const users = await findConversationPeople(id);
    for (const tempUser of users) {
      // Incrementing the count of seen conversations
      const seen = await isConversationSeen(id, tempUser.userId);
      if (seen) {
        // It should be seen to update it to unseen
        if (tempUser.userId !== user.id)
          await incrementSeenConversation(tempUser.userId, 1);
      }
    }
    await prisma.userConversations.updateMany({
      where: { conversationId: id, NOT: { userId: user.id } },
      data: { seen: false },
    });
    const formattedMessage = {
      profileImageUrl: user.profileImageUrl,
      userName: user.userName,
      replyToMessage: req.body.replyId
        ? {
            ...createdMessage.reply,
            userName: (await getUserByID(createdMessage.reply?.userId || ''))
              ?.userName,
          }
        : null,
      id: createdMessage.id,
      entities: createdMessage.entities,
      text: createdMessage.text,
      isMessage: createdMessage.isMessage,
      date: createdMessage.date,
    };
    // Send the message to the socket
    return res.status(201).json({
      createdMessage: formattedMessage,
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
        where: {
          userName: user.toLowerCase(),
          deletedAt: null,
          blocked: { none: { blocker: { userName: authUser.userName } } },
          blocker: { none: { blocked: { userName: authUser.userName } } },
        },
        select: { id: true, name: true },
      });
      if (!tempUser) return next(new AppError('not all users are found', 401));
      if (tempUser.id == authUser.id)
        return next(
          new AppError("can't create conversation with yourself", 402),
        );
      usersIDs.push(tempUser);
    }
    if (users.length == 0) return next(new AppError('no users provided', 403));
    const usersDetails: object[] = [];
    for (const tempUser of usersIDs) {
      const user = await prisma.user.findFirst({
        where: {
          id: tempUser.id,
        },
        select: {
          userName: true,
          name: true,
          followersCount: true,
          followingCount: true,
          description: true,
          profileImageUrl: true,
        },
      });
      const isFollowed = await isUserFollowing(authUser.id, tempUser.id);
      const isFollowing = await isUserFollowing(tempUser.id, authUser.id);
      usersDetails.push({
        ...user,
        isFollowing: isFollowing,
        isFollowed: isFollowed,
      });
    }
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
      if (tempConv) {
        tempConv.name = usersIDs[0].name;
        return res
          .json({ ...tempConv, fullName: tempConv.name, users: usersDetails })
          .status(200);
      }
      newConv = await prisma.conversation.create({
        data: {
          name: null,
          isGroup: false,
          UserConversations: {
            create: [
              { userId: authUser.id, seen: true },
              { userId: usersIDs[0].id, seen: false },
            ],
          },
        },
      });
      await prisma.message.create({
        data: {
          text: '',
          userId: authUser.id,
          date: new Date(),
          conversationId: newConv.id,
          isMessage: false,
        },
      });
    } else {
      newConv = await prisma.conversation.create({
        data: {
          name: null,
          isGroup: true,
          UserConversations: {
            create: [
              { userId: authUser.id, seen: true, dateJoined: new Date() },
            ],
          },
        },
      });
      await prisma.message.create({
        data: {
          text: authUser.userName + ' created this group',
          userId: authUser.id,
          date: new Date(),
          conversationId: newConv.id,
          isMessage: false,
        },
      });
      for (var tempUser of usersIDs) {
        await prisma.userConversations.create({
          data: {
            conversationId: newConv.id,
            userId: tempUser.id,
            seen: false,
          },
        });
      }
    }
    let now = new Date();
    newConv.name =
      users.slice(0, 3).join(', ') +
      `${users.length - 3 > 0 ? ` and ${users.length - 3} more` : ''}`;
    return res
      .json({
        ...newConv,
        fullName: users.join(', '),

        dateJoined: newConv.isGroup ? now : '',
        users: usersDetails,
      })
      .status(200);
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
    if (!deletedConv) return res.status(404).json({ operationSuccess: false });
    await prisma.message.create({
      data: {
        text: authUser.userName + ' left this group',
        userId: authUser.id,
        date: new Date(),
        conversationId: deletedConv.conversationId,
        isMessage: false,
      },
    });
    res.json({ operationSuccess: true }).status(200);
    return;
  },
);

export const deleteMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.message_id;
    const message = await prisma.message.findFirst({ where: { id } });
    if (!message) {
      next(new AppError('Message not found', 404));
    } else {
      await prisma.message.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      res.json({ operationSuccess: true }).status(200);
    }
  },
);

export const getConversation = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const authUser = req.user as User;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    let convs = await prisma.message.findMany({
      distinct: ['conversationId'],
      orderBy: {
        date: 'desc',
      },
      skip: skip,
      take: parsedLimit,
      where: {
        Conversation: {
          UserConversations: {
            some: {
              userId: authUser.id,
            },
          },
        },
      },
      select: {
        id: true,
        text: true,
        date: true,
        isMessage: true,
        sender: {
          select: {
            id: true,
            name: true,
            userName: true,
            profileImageUrl: true,
            description: true,
            followersCount: true,
            followingCount: true,
          },
        },
        Conversation: {
          select: {
            UserConversations: {
              select: {
                User: {
                  select: {
                    id: true,
                    name: true,
                    userName: true,
                    profileImageUrl: true,
                    description: true,
                    followersCount: true,
                    followingCount: true,
                  },
                },
                dateJoined: true,
              },
            },
            id: true,
            photo: true,
            name: true,
            isGroup: true,
          },
        },
      },
    });

    let responseConvs = [];

    for (var tempConv of convs) {
      let entities;
      let lastMessage = {};
      if (tempConv) {
        entities = await getMessageEntities(tempConv.id);
        let mediaText =
          tempConv.sender.userName + 'sent ' + entities.media[0]?.type;
        lastMessage = {
          isMessage: tempConv.isMessage,
          id: tempConv.id,
          date: tempConv.date,
          text: entities.media.length != 0 ? mediaText : tempConv.text,
          replyToMessage: {},
          userName: tempConv.sender.userName,
          profileImageUrl: tempConv.sender.profileImageUrl,
          entities: entities,
        };
      }
      let status = await prisma.userConversations.findUnique({
        where: {
          userId_conversationId: {
            userId: authUser.id,
            conversationId: tempConv.Conversation.id,
          },
        },
        select: {
          seen: true,
        },
      });
      let users = [];
      for (let i = 0; i < tempConv.Conversation.UserConversations.length; i++) {
        if (
          tempConv.Conversation.UserConversations[i].User.userName !=
          authUser.userName
        ) {
          const isFollowed = await isUserFollowing(
            authUser.id,
            tempConv.Conversation.UserConversations[i].User.id,
          );
          const isFollowing = await isUserFollowing(
            tempConv.Conversation.UserConversations[i].User.id,
            authUser.id,
          );
          const isBlocked = await isUserBlocked(
            authUser.id,
            tempConv.Conversation.UserConversations[i].User.id,
          );
          const isMuted = await isUserMuted(
            authUser.id,
            tempConv.Conversation.UserConversations[i].User.id,
          );
          const user = {
            name: tempConv.Conversation.UserConversations[i].User.name,
            userName: tempConv.Conversation.UserConversations[i].User.userName,
            description:
              tempConv.Conversation.UserConversations[i].User.description,
            followersCount:
              tempConv.Conversation.UserConversations[i].User.followersCount,
            followingCount:
              tempConv.Conversation.UserConversations[i].User.followingCount,
            profileImageUrl:
              tempConv.Conversation.UserConversations[i].User.profileImageUrl,
          };
          users.push({
            ...user,
            isFollowing: isFollowing,
            isFollowed: isFollowed,
            isBlocked: isBlocked,
            isMuted: isMuted,
          });
        }
      }
      let newName, newFullName;
      if (tempConv.Conversation.name) {
        newName = tempConv.Conversation.name;
        newFullName = tempConv.Conversation.name;
      } else {
        newName =
          users
            .slice(0, 3)
            .map((user) => user.name)
            .join(', ') +
          `${users.length - 3 > 0 ? ` and ${users.length - 3} more` : ''}`;
        newFullName = users.map((user) => user.name).join(', ');
      }
      let i = 0;
      if (
        tempConv.Conversation.UserConversations[i].User.userName ==
        authUser.userName
      ) {
        i++;
      }
      const isBlocked = await isUserBlocked(
        authUser.id,
        tempConv.Conversation.UserConversations[i].User.id,
      );
      const isBlocker = await isUserBlocked(
        tempConv.Conversation.UserConversations[i].User.id,
        authUser.id,
      );
      let tempResponse = {
        id: tempConv.Conversation.id,
        name: newName,
        fullName: newFullName,
        lastMessage: lastMessage,
        photo: tempConv.Conversation.photo,
        isGroup: tempConv.Conversation.isGroup,
        dateJoined: tempConv.Conversation.isGroup
          ? tempConv.Conversation.UserConversations.find(
              (u) => u.User.userName == (req.user as User).userName,
            )?.dateJoined
          : '',
        users: users,
        seen: status?.seen || false,
        blocked: !tempConv.Conversation.isGroup && (isBlocked || isBlocker),
      };
      responseConvs.push(tempResponse);
    }
    await resetSeenConversation(authUser.id);
    return res.json(responseConvs).status(200);
  },
);

export const postConversationUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const conversationId = req.params.id;
    const conversation = await findConversationById(conversationId);

    if (!conversation) {
      return res.status(500).json({ message: 'Oops! Something went wrong' });
    }
    if (!conversation.isGroup) {
      return next(
        new AppError('You can not add users to direct messages', 401),
      );
    }

    let users = req.body.users as Array<string>;

    if (!users) {
      return next(new AppError('No users to add', 401));
    }

    users = users.map((user) => user.toLowerCase());
    const usersData = await prisma.user.findMany({
      where: {
        userName: {
          in: users,
        },
        deletedAt: null,
      },
      select: { id: true },
    });

    const conversationPeople = await findConversationPeople(conversationId);

    if (usersData.length !== users.length) {
      return next(new AppError('Not all users are found', 404));
    }
    let userExists = false;
    // O (N ^ 2) Not so good
    usersData.forEach((idToCheck) => {
      if (
        conversationPeople.some(
          (item) =>
            JSON.stringify(item) === JSON.stringify({ userId: idToCheck.id }),
        )
      ) {
        userExists = true;
      }
    });

    if (userExists) return next(new AppError('User already exists', 401));

    await addPeopleToConversation(conversationId, usersData);

    return res.status(201).json({ message: 'Users added successfully' });
  },
);

export const searchConversations = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { q, page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    if (!q) {
      res.status(400).json({
        status: 'error',
        message: 'Query parameter "q" is required.',
      });
      return;
    }

    const userId = (req.user as User).id;

    const conversationsPeopleGroups = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            UserConversations: {
              some: {
                userId,
              },
            },
          },
          {
            OR: [
              {
                name: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
              {
                UserConversations: {
                  some: {
                    User: {
                      userName: {
                        contains: q as string,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
              {
                UserConversations: {
                  some: {
                    User: {
                      name: {
                        contains: q as string,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        photo: true,
        UserConversations: {
          select: {
            User: {
              select: {
                userName: true,
                profileImageUrl: true,
                name: true,
              },
            },
            seen: true,
            dateJoined: true,
          },
        },
        Message: {
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
          where: {
            text: {
              contains: q as string,
              mode: 'insensitive',
            },
          },
          take: 1,
          orderBy: {
            date: 'desc',
          },
        },
      },
      skip,
      take: parsedLimit,
    });

    const conversationsMessage = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            UserConversations: {
              some: {
                userId,
              },
            },
          },
          {
            OR: [
              {
                Message: {
                  some: {
                    text: {
                      contains: q as string,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        photo: true,
        UserConversations: {
          select: {
            User: {
              select: {
                userName: true,
                profileImageUrl: true,
                name: true,
              },
            },
            dateJoined: true,
            seen: true,
          },
        },
        Message: {
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
          where: {
            text: {
              contains: q as string,
              mode: 'insensitive',
            },
          },
          take: 1,
          orderBy: {
            date: 'desc',
          },
        },
      },
      skip,
      take: parsedLimit,
    });

    const groups = conversationsPeopleGroups
      .filter((consversation) => consversation.isGroup)
      .map((conversation) => ({
        id: conversation.id,
        name: conversation.name,
        type: conversation?.isGroup ? 'group' : 'direct',
        photo: conversation.photo,
        dateJoined: conversation?.isGroup
          ? conversation.UserConversations.find(
              (u) => u.User.userName == (req.user as User).userName,
            )?.dateJoined
          : '',
        users: conversation.UserConversations.map((userConversation) => ({
          userName: userConversation.User.userName,
          name: userConversation.User.name,
          profileImageUrl: userConversation.User.profileImageUrl,
        })).filter((user) => user.userName != (req.user as User).userName),
        lastMessage:
          conversation.Message.length > 0 ? conversation.Message[0] : null,
        seen:
          conversation.UserConversations.find(
            (u) => u.User.userName == (req.user as User).userName,
          )?.seen || false,
      }));

    const people = conversationsPeopleGroups
      .filter((consversation) => !consversation.isGroup)
      .map((conversation) => ({
        id: conversation.id,
        name: conversation.name,
        type: conversation?.isGroup ? 'group' : 'direct',
        photo: conversation.photo,
        users: conversation.UserConversations.map((userConversation) => ({
          userName: userConversation.User.userName,
          name: userConversation.User.name,
          profileImageUrl: userConversation.User.profileImageUrl,
        })).filter((user) => user.userName != (req.user as User).userName),
        lastMessage:
          conversation.Message.length > 0 ? conversation.Message[0] : null,
        seen:
          conversation.UserConversations.find(
            (u) => u.User.userName == (req.user as User).userName,
          )?.seen || false,
      }));

    const messages = conversationsMessage.map((conversation) => ({
      id: conversation.id,
      name: conversation.name,
      isGroup: conversation?.isGroup,
      photo: conversation.photo,
      dateJoined: conversation?.isGroup
        ? conversation.UserConversations.find(
            (u) => u.User.userName == (req.user as User).userName,
          )?.dateJoined
        : '',
      users: conversation.UserConversations.map((userConversation) => ({
        userName: userConversation.User.userName,
        name: userConversation.User.name,
        profileImageUrl: userConversation.User.profileImageUrl,
      })).filter((user) => user.userName != (req.user as User).userName),
      lastMessage:
        conversation.Message.length > 0 ? conversation.Message[0] : null,
      seen:
        conversation.UserConversations.find(
          (u) => u.User.userName == (req.user as User).userName,
        )?.seen || false,
    }));

    res.status(200).json({
      status: 'success',
      groups,
      people,
      messages,
    });
  },
);
