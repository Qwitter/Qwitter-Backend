import { authorSelectOptions } from '../types/user';
import prisma from '../client';
import { getTweetEntities } from './entityRepository';

/**
 * get the user by its username and makes sure it is not deleted
 */
export const getUserByUsername = async (user_name: string) => {
  if (!user_name) return null;
  return await prisma.user.findUnique({
    where: {
      userName: user_name.toLowerCase(),
      deletedAt: null,
    },
  });
};
/**
 * get the user by its id and makes sure it is not deleted
 */
export const getUserByID = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
};
/**
 * gets whether a blockedUser is blocked by blocking user
 */

export const getUserBlocked = async (
  blockingUser: string,
  blockedUser: string,
) => {
  return await prisma.block.findUnique({
    where: {
      blockerId_blockedId: { blockedId: blockedUser, blockerId: blockingUser },
    },
  });
};
/**
* blocks user and removes from following or followers list if he exists
*/

export const blockUserByIDs = async (
  blockingUser: string,
  blockedUser: string,
) => {
  const followCheck = await prisma.follow.findUnique({
    where: {
      folowererId_followedId: {
        followedId: blockedUser,
        folowererId: blockingUser,
      },
    },
  });
  followCheck &&
    (await prisma.follow.delete({
      where: {
        folowererId_followedId: {
          followedId: blockedUser,
          folowererId: blockingUser,
        },
      },
    }));
  followCheck &&
    (await prisma.user.update({
      where: { id: blockingUser },
      data: { followingCount: { decrement: 1 } },
    }));
  followCheck &&
    (await prisma.user.update({
      where: { id: blockedUser },
      data: { followersCount: { decrement: 1 } },
    }));

  const followCheck2 = await prisma.follow.findUnique({
    where: {
      folowererId_followedId: {
        followedId: blockingUser,
        folowererId: blockedUser,
      },
    },
  });
  followCheck2 &&
    (await prisma.follow.delete({
      where: {
        folowererId_followedId: {
          followedId: blockingUser,
          folowererId: blockedUser,
        },
      },
    }));
  followCheck2 &&
    (await prisma.user.update({
      where: { id: blockingUser },
      data: { followersCount: { decrement: 1 } },
    }));
  followCheck2 &&
    (await prisma.user.update({
      where: { id: blockedUser },
      data: { followingCount: { decrement: 1 } },
    }));

  return await prisma.block.create({
    data: {
      blockedId: blockedUser,
      blockerId: blockingUser,
    },
  });
};
/**
* unblocks a user
*/
export const unblockUserByIDs = async (
  blockingUser: string,
  blockedUser: string,
) => {
  return await prisma.block.delete({
    where: {
      blockerId_blockedId: { blockedId: blockedUser, blockerId: blockingUser },
    },
  });
};
/**
* gets the users blocked by a specific user and makes sure ther exist
*/

export const getBlockedUsersByID = async (blockingUser: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: blockingUser,
      deletedAt: null,
    },
    include: {
      blocker: true,
    },
  });
  let blockedUsersIDs = user?.blocker;
  let blockedUsers = [];
  if (blockedUsersIDs)
    for (var blockedUserRelations of blockedUsersIDs) {
      let blockedUser = await prisma.user.findFirst({
        where: {
          id: blockedUserRelations.blockedId,
          deletedAt: null,
        },
      });
      if (blockedUser)
        blockedUsers.push({
          userName: blockedUser.userName,
          name: blockedUser.name,
          birthDate: blockedUser.birthDate,
          url: blockedUser.url,
          description: blockedUser.description,
          protected: blockedUser.protected,
          verified: blockedUser.verified,
          followersCount: blockedUser.followersCount,
          followingCount: blockedUser.followingCount,
          createdAt: blockedUser.createdAt,
          profileBannerUrl: blockedUser.profileBannerUrl,
          profileImageUrl: blockedUser.profileImageUrl,
          email: blockedUser.email.toLowerCase(),
        });
    }

  return blockedUsers;
};

/**
* gets tweets created by user in paginated form and chronological order and fetches relevant entities
*/
export const getTweetsCreatedByUser = async (
  userId: string,
  skip: number = 0,
  take: number = 10,
) => {
  const tweets =
    (await prisma.tweet.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        author: {
          select: authorSelectOptions,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    })) || [];
  let tweetWithEntities = [];
  for (var tweet of tweets) {
    const entities = await getTweetEntities(tweet.id);
    tweetWithEntities.push({ ...tweet, entities });
  }
  return tweetWithEntities;
};
/**
* checks if user1 follows user2
*/

export const isUserFollowing = async (
  userid1: string,
  userid2: string,
): Promise<boolean> => {
  if (!userid1 || !userid2) return false;
  try {
    const followRelationship = await prisma.follow.findUnique({
      where: {
        folowererId_followedId: {
          folowererId: userid1,
          followedId: userid2,
        },
      },
    });
    return !!followRelationship;
  } catch (err) {
    return false;
  }
};
/**
* checks if user1 blocked user2
*/
export const isUserBlocked = async (
  userid1: string,
  userid2: string,
): Promise<boolean> => {
  if (!userid1 || !userid2) return false;
  try {
    const blockRelationship = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: userid1,
          blockedId: userid2,
        },
      },
    });
    return !!blockRelationship;
  } catch (err) {
    return false;
  }
};
/**
* checks if user1 muted user2
*/
export const isUserMuted = async (
  userid1: string,
  userid2: string,
): Promise<boolean> => {
  if (!userid1 || !userid2) return false;
  try {
    const muteRelationship = await prisma.mute.findUnique({
      where: {
        muterId_mutedId: {
          muterId: userid1,
          mutedId: userid2,
        },
      },
    });
    return !!muteRelationship;
  } catch (err) {
    return false;
  }
};
/**
* gets users whose name or username are relevant to a query and returns them sorted according to their relevancy to the query
*/

export const getUsersByName = async (
  query: string,
  skip: number,
  parsedLimit: number,
) => {
  let words: string[];
  words = query.split(' ');
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
      birthDate: true,
      location: true,
      url: true,
      description: true,
      verified: true,
      followersCount: true,
      followingCount: true,
      createdAt: true,
      profileBannerUrl: true,
      profileImageUrl: true,
      email: true,
      userName: true,
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
    return rest;
  });
};

/**
* gets the number of tweets for a certain user if he was not deleted
*/


export const getNumOfTweets = async (userName: string) => {
  if (!userName) return 0;
  const user = await prisma.user.findFirst({
    where: {
      userName: userName.toLowerCase(),
      Tweet: { some: { deletedAt: null } },
    },
    include: {
      Tweet: {},
    },
  });
  if (!user) return 0;
  if (!user.Tweet) return 0;
  return user.Tweet.length;
};
