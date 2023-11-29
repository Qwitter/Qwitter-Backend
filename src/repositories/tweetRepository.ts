import prisma from '../client';
import { getTweetEntities } from './entityRepository';

export const getTweetAndUserById = async (tweetId: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
      deletedAt: null,
    },
    include: {
      TweetEntity: true,
    },
  });
  let user;
  if (tweet) {
    user = await prisma.user.findUnique({
      where: {
        id: tweet?.userId,
      },
    });
  }
  return { tweet: tweet, tweetingUser: user };
};

export const searchTweet = async (
  query: string | null,
  hashtag: string | null,
  skip: number,
  parsedLimit: number,
) => {
  let tweets;
  let words: string[];
  if (hashtag) {
    tweets = await prisma.tweet.findMany({
      where: {
        TweetEntity: {
          some: { entity: { Hashtag: { text: hashtag } } },
        },
        deletedAt: null,
      },
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
      skip,
      take: parsedLimit,
    });
  } else if (query) {
    words = query.split(' ');
    tweets = await prisma.tweet.findMany({
      where: {
        OR: words.map((word) => ({
          OR: [
            { text: { contains: word } },
            { author: { userName: { contains: word } } },
            { author: { name: { contains: word } } },
            {
              TweetEntity: {
                some: { entity: { Hashtag: { text: word } } },
              },
            },
          ],
        })),
        deletedAt: null,
      },
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
      skip,
      take: parsedLimit,
    });
  }

  const Querytweets = [];

  if (tweets)
    for (const tweet of tweets) {
      const entities = await getTweetEntities(tweet.id);
      const temp = { ...tweet, entities: entities };
      Querytweets.push(temp);
    }

  if (query) {
    const matchCount = Querytweets.map((tweet) => ({
      ...tweet,
      matchCount: words.reduce(
        (count, word) =>
          count +
          ((tweet.text as string).toLowerCase().includes(word.toLowerCase()) ||
          (tweet.author.userName as string)
            .toLowerCase()
            .includes(word.toLowerCase()) ||
          (tweet.author.name as string)
            .toLowerCase()
            .includes(word.toLowerCase()) ||
          tweet.entities.hashtags.some((Hashtag) =>
            Hashtag.text.toLowerCase().match(word.toLowerCase()),
          )
            ? 1
            : 0),
        0,
      ),
    }));
    const sortedPosts = matchCount.sort((a, b) => b.matchCount - a.matchCount);
    return sortedPosts.map((el) => {
      const { matchCount, ...rest } = el;
      return rest;
    });
  }

  return Querytweets;
};
export const deleteTweetById = async (tweetId: string) => {
  await prisma.tweet.update({
    where: {
      id: tweetId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
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

export const getTweetsMediaById = async (
  Id: string,
  skip: number,
  parsedLimit: number,
) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      userId: Id,
      TweetEntity: { some: { entity: { type: 'media' } } },
      deletedAt: null,
    },
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
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: parsedLimit,
  });

  const mediaTweets = [];

  for (const tweet of tweets) {
    const entities = await getTweetEntities(tweet.id);
    const temp = { ...tweet, entities: entities };
    mediaTweets.push(temp);
  }

  return mediaTweets;
};
