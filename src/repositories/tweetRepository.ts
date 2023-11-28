import prisma from '../client';
import { getTweetEntities } from './entityRepository';

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

export const getTweetsLikedById = async (
  Id: string,
  skip: number,
  parsedLimit: number,
) => {
  const tweets = await prisma.like.findMany({
    where: {
      userId: Id,
      liked: {
        deletedAt: null,
      },
    },
    select: {
      liked: {
        select: {
          createdAt: true,
          id: true,
          text: true,
          source: true,
          coordinates: true,
          author: {
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
          },
          replyToTweetId: true,
          replyCount: true,
          retweetedId: true,
          retweetCount: true,
          qouteTweetedId: true,
          qouteCount: true,
          likesCount: true,
          sensitive: true,
        },
      },
    },
    orderBy: {
      liked: {
        createdAt: 'desc',
      },
    },
    skip,
    take: parsedLimit,
  });

  const likedTweets = [];

  for (const tweet of tweets) {
    const entities = await getTweetEntities(tweet.liked.id);
    const temp = { ...tweet.liked, entities: entities };
    likedTweets.push(temp);
  }

  return likedTweets;
};
