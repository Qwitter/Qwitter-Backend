import prisma from '../client';

export const getUserByUsername = async (user_name: string) => {
  return await prisma.user.findUnique({
    where: {
      userName: user_name,
    },
  });
};
