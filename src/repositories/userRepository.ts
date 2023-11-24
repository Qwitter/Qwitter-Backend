import prisma from '../client';

export const getUserByUsername = async (user_name: string) => {
  return await prisma.user.findUnique({
    where: {
      userName: user_name,
    },
  });
};


export const getUserBlocked=async (blockingUser: string,blockedUser: string) => {
  return await prisma.block.findUnique({
    where: {
      blockerId_blockedId:{blockedId:blockedUser,blockerId:blockingUser}
    },
  });
};


export const blockUserByIDs=async (blockingUser: string,blockedUser: string) => {
  return await prisma.block.create({
    data: {
      blockedId:blockedUser,
      blockerId:blockingUser
    }
  })
};


export const unblockUserByIDs=async (blockingUser: string,blockedUser: string) => {
  return await prisma.block.delete({
    where: {
      blockerId_blockedId:{blockedId:blockedUser,blockerId:blockingUser}
    },
  })
};
