import prisma from '../client';

export const getUserByUsername = async (user_name: string) => {
  return await prisma.user.findUnique({
    where: {
      userName: user_name,
    },
  });
};

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

export const blockUserByIDs = async (
  blockingUser: string,
  blockedUser: string,
) => {
  return await prisma.block.create({
    data: {
      blockedId: blockedUser,
      blockerId: blockingUser,
    },
  });
};

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

export const getBlockedUsersByID = async (blockingUser: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: blockingUser,
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
