import { User } from '@prisma/client';
import prisma from '../client';

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
    },
    select: {
      name: true,
      userName: true,
      profileImageUrl: true,
      follower: { where: { followedId: requester.id } },
      followed: { where: { folowererId: requester.id } },
      UserConversations: { where: { conversationId: conversationId } },
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
    };
    return user;
  });
};
