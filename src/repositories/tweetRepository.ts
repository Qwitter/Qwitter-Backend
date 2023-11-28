import prisma from '../client';

export const getTweetAndUserById = async (tweetId: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
    include: {
      TweetEntity: true,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: tweet?.userId,
    },
  });
  return { tweet: tweet, tweetingUser: user };
};
export const deleteTweetById = async (tweetId: string) => {
  await prisma.tweet.update({
    where: {
      id: tweetId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
