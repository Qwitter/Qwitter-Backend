import prisma from '../client';



export const getTweetAndUserById=async (tweetId: string) => {
    const tweet= await prisma.tweet.findUnique({
      where: {
        id: tweetId,
      },
      include: {
        TweetEntity: true,
      },
    });
    const user= await prisma.user.findUnique({
        where:{
            id:tweet?.userId
        }
    });
    return {tweet:tweet,tweetingUser:user}
  };