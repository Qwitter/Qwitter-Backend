import { User } from '@prisma/client';
import prisma from '../client';
import {
  createEntityMessage,
  createMedia,
  extractEntities,
  getMessageEntities,
} from './entityRepository';
import { sendUnseenConversationCount } from '../utils/notifications';

/**
 * search for users to add to conversation
 * return array of users who are eligible to add
 */
export const searchMember = async (
  query: string,
  skip: number,
  parsedLimit: number,
  conversationId: string,
  requester: User,
) => {
  const words = query.split(' ');
  const users = await prisma.user.findMany({
    where: {
      OR: words.map((word) => ({
        OR: [
          { name: { contains: word, mode: 'insensitive' } },
          { userName: { contains: word, mode: 'insensitive' } },
        ],
      })),
      deletedAt: null,
      blocker: { none: { blockedId: requester.id } },
    },
    select: {
      name: true,
      userName: true,
      profileImageUrl: true,
      follower: { where: { followedId: requester.id } },
      followed: { where: { folowererId: requester.id } },
      UserConversations: { where: { conversationId: conversationId } },
      blocked: { where: { blockerId: requester.id } },
      muted: { where: { muterId: requester.id } },
    },
    skip,
    take: parsedLimit,
  });

  const matchCount = users.map((user) => ({
    ...user,
    matchCount: words.reduce(
      (count, word) =>
        count +
        ((user.userName as string).toLowerCase().includes(word.toLowerCase())
          ? 2
          : 0) +
        ((user.name as string).toLowerCase().includes(word.toLowerCase())
          ? 1
          : 0),
      0,
    ),
  }));

  const sortedUsers = matchCount.sort((a, b) => b.matchCount - a.matchCount);
  return sortedUsers.map((el) => {
    const { matchCount, ...rest } = el;
    const user = {
      name: rest.name,
      userName: rest.userName,
      profileImageUrl: rest.profileImageUrl,
      isFollowing: rest.followed && rest.followed.length ? true : false,
      isFollowed: rest.follower && rest.follower.length ? true : false,
      inConversation:
        rest.UserConversations && rest.UserConversations.length ? true : false,
      isBlocked: rest.blocked && rest.blocked.length ? true : false,
      isMuted: rest.muted && rest.muted.length ? true : false,
    };
    return user;
  });
};

/**
 * search for users to create a new conversation
 * return array of users who are eligible to add
 */
export const searchMemberForNewConversation = async (
  query: string,
  skip: number,
  parsedLimit: number,
  requester: User,
) => {
  const words = query.split(' ');
  const users = await prisma.user.findMany({
    where: {
      OR: words.map((word) => ({
        OR: [
          { name: { contains: word, mode: 'insensitive' } },
          { userName: { contains: word, mode: 'insensitive' } },
        ],
      })),
      deletedAt: null,
      blocker: { none: { blockedId: requester.id } },
    },
    select: {
      name: true,
      userName: true,
      profileImageUrl: true,
      follower: { where: { followedId: requester.id } },
      followed: { where: { folowererId: requester.id } },
      blocked: { where: { blockerId: requester.id } },
      muted: { where: { muterId: requester.id } },
    },
    skip,
    take: parsedLimit,
  });

  const matchCount = users.map((user) => ({
    ...user,
    matchCount: words.reduce(
      (count, word) =>
        count +
        ((user.userName as string).toLowerCase().includes(word.toLowerCase())
          ? 2
          : 0) +
        ((user.name as string).toLowerCase().includes(word.toLowerCase())
          ? 1
          : 0),
      0,
    ),
  }));

  const sortedUsers = matchCount.sort((a, b) => b.matchCount - a.matchCount);
  return sortedUsers.map((el) => {
    const { matchCount, ...rest } = el;
    const user = {
      name: rest.name,
      userName: rest.userName,
      profileImageUrl: rest.profileImageUrl,
      isFollowing: rest.followed && rest.followed.length ? true : false,
      isFollowed: rest.follower && rest.follower.length ? true : false,
      isBlocked: rest.blocked && rest.blocked.length ? true : false,
      isMuted: rest.muted && rest.muted.length ? true : false,
    };
    return user;
  });
};

/**
 * create a message
 * return a formated message
 */
export const createMessage = async (
  text: string,
  userId: string,
  conversationId: string,
  replyId: string | null,
  mediaUrl: string | undefined,
) => {
  const currentDate = new Date();
  const createdMessage = await prisma.message.create({
    data: {
      userId,
      text,
      conversationId,
      date: currentDate,
      replyToMessageId: replyId ? replyId : null,
    },
    include: {
      reply: true,
    },
  });
  //Extract the entities
  const entitiesId: string[] = await extractEntities(text);
  if (mediaUrl) {
    const createdMedia = await createMedia(mediaUrl, 'message/');
    entitiesId.push(createdMedia.entityId);
  }

  // Linking Entities with Tweets
  for (const id of entitiesId) {
    await createEntityMessage(createdMessage.id, id);
  }
  const entities = await getMessageEntities(createdMessage.id);

  // update seen status when message is sent

  return { ...createdMessage, entities };
};

/**
 * get conversation by Id
 * return the conversation object
 */
export const getConvsersationById = async (id: string) => {
  return await prisma.conversation.findUnique({
    where: {
      id,
    },
  });
};

/**
 * checks if user has a conversation
 * return the conversation object
 */
export const userConversationExists = async (
  userId: string,
  conversationId: string,
) => {
  return await prisma.userConversations.findFirst({
    where: {
      conversationId,
      userId,
    },
  });
};

/**
 * checks if the message replying to is a valid message
 * return the message object
 */
export const validMessageReply = async (
  conversationId: string,
  messageId: string,
) => {
  return await prisma.message.findFirst({
    where: {
      conversationId,
      id: messageId,
    },
  });
};

/**
 * add users to conversation
 */
export const addPeopleToConversation = async (
  conversationId: string,
  users: { id: string }[],
) => {
  const insertedData = users.map((user) => ({
    conversationId: conversationId,
    userId: user.id,
    seen: false,
  }));

  await prisma.userConversations.createMany({
    data: insertedData,
  });
};

/**
 * find all people in a certain conversation
 * returns array of user IDs
 */
export const findConversationPeople = async (conversationId: string) => {
  return await prisma.userConversations.findMany({
    where: { conversationId },
    select: {
      userId: true,
    },
  });
};

/**
 * find conversation by Id
 * returns Conversation object
 */
export const findConversationById = async (conversationId: string) => {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
};

/**
 * checks if conversation is seen
 * returns boolean
 */
export const isConversationSeen = async (
  conversationId: string,
  userId: string,
) => {
  const conversation = await prisma.userConversations.findUnique({
    where: { userId_conversationId: { userId, conversationId } },
  });
  return conversation?.seen;
};

/**
 * resets unseen conversations count
 */
export const resetSeenConversation = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      unSeenConversation: 0,
    },
  });
};

/**
 * increment user unseen value
 */
export const incrementSeenConversation = async (
  userId: string,
  val: number,
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      unSeenConversation: { increment: val },
    },
  });
  sendUnseenConversationCount(
    updatedUser.userName,
    updatedUser.unSeenConversation as number,
  );
};
