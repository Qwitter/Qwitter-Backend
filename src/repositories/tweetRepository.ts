import { authorSelectOptions } from '../types/user';
import prisma from '../client';
import { getTweetEntities } from './entityRepository';
import { Tweet, User } from '@prisma/client';
import { isUserFollowing, isUserMuted } from './userRepository';

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
        deletedAt: null,
      },
    });
  }
  return { tweet: tweet, tweetingUser: user };
};

export const getTweetAndEntitiesById = async (
  tweetId: string,
  userId: string,
) => {
  let tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
      deletedAt: null,
    },
    include: {
      author: {
        select: { ...authorSelectOptions, id: true },
      },
    },
  });
  const isMuted = await isUserMuted(userId, tweet?.author.id as string);
  const liked = await isLiked(userId, tweet?.id as string);
  const isFollowing = await isUserFollowing(userId, tweet?.author.id as string);
  const currentUserRetweetId = await isRetweeted(userId, tweet as Tweet);
  // Removing ID for security purposes
  const tweetWithoutUserId = JSON.parse(JSON.stringify(tweet)); // Deep clone to avoid reference
  delete tweetWithoutUserId?.author?.id;
  const entities = await getTweetEntities(tweetId);
  return {
    ...tweetWithoutUserId,
    entities,
    isMuted,
    isFollowing,
    currentUserRetweetId,
    liked,
  };
};
export const getTweetById = async (tweetId: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
      deletedAt: null,
    },
    include: {
      author: {
        select: authorSelectOptions,
      },
    },
  });

  if (tweet) return { ...tweet, author: tweet?.author };
  return null;
};

export const searchTweet = async (
  query: string | null,
  hashtag: string | null,
  skip: number,
  parsedLimit: number,
  currentUser: User,
) => {
  let tweets;
  let words: string[];
  if (hashtag) {
    tweets =
      (await prisma.tweet.findMany({
        where: {
          TweetEntity: {
            some: { entity: { Hashtag: { text: hashtag } } },
          },
          deletedAt: null,
          author: {
            blocked: { none: { blocker: { id: currentUser.id } } },
            blocker: { none: { blocked: { id: currentUser.id } } },
          },
        },
        select: {
          createdAt: true,
          id: true,
          text: true,
          source: true,
          coordinates: true,
          author: {
            select: authorSelectOptions,
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
      })) || [];
  } else if (query) {
    words = query.split(' ');
    tweets =
      (await prisma.tweet.findMany({
        where: {
          OR: words.map((word) => ({
            OR: [
              { text: { contains: word, mode: 'insensitive' } },
              { author: { userName: { contains: word, mode: 'insensitive' } } },
              { author: { name: { contains: word, mode: 'insensitive' } } },
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
            select: authorSelectOptions,
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
      })) || [];
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
  const tweet = await prisma.tweet.update({
    where: {
      id: tweetId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  prisma.tweet.updateMany({
    where: {
      retweetedId: tweetId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  if (tweet.replyToTweetId) {
    await incrementReplies(tweet.replyToTweetId, -1);
  }
  if (tweet.retweetedId) {
    await incrementRetweet(tweet.retweetedId, -1);
  }
};

export const getTweetsLikedById = async (
  Id: string,
  skip: number,
  parsedLimit: number,
) => {
  const tweets =
    (await prisma.like.findMany({
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
              select: authorSelectOptions,
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
    })) || [];

  const likedTweets = [];

  for (const tweet of tweets) {
    const entities = await getTweetEntities(tweet.liked.id);
    const temp = { ...tweet.liked, entities: entities, liked: true };
    likedTweets.push(temp);
  }

  return likedTweets;
};

export const getTweetsMediaById = async (
  Id: string,
  skip: number,
  parsedLimit: number,
  currentUser: User,
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
        select: authorSelectOptions,
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
    const liked = await prisma.like.findFirst({
      where: {
        userId: currentUser.id,
        tweetId: tweet.id,
      },
    });
    const entities = await getTweetEntities(tweet.id);
    const temp = { ...tweet, entities: entities, liked: liked != null };
    mediaTweets.push(temp);
  }

  return mediaTweets;
};
export const incrementLikes = async (id: string, val: number = 1) => {
  await prisma.tweet.update({
    where: { id },
    data: {
      likesCount: { increment: val },
    },
  });
};
export const incrementReplies = async (id: string, val: number = 1) => {
  await prisma.tweet.update({
    where: { id },
    data: {
      replyCount: { increment: val },
    },
  });
};
export const incrementRetweet = async (id: string, val: number = 1) => {
  await prisma.tweet.update({
    where: { id },
    data: {
      retweetCount: { increment: val },
    },
  });
};
export const getTweetsRepliesRetweets = async (
  tweets: any[],
  userId: string,
) => {
  let newTweets = [];
  for (const tweet of tweets) {
    if (tweet.replyToTweetId) {
      newTweets.push(await getTweetReply(tweet, userId));
    } else if (tweet.retweetedId) {
      let retweetedTweet = await getTweetRetweet(tweet, userId); // This the is the original tweet + The retweeted tweet
      if (retweetedTweet.retweetedTweet.replyToTweetId) {
        // If the retweeted is a reply
        let retweetReply = await getTweetReply(
          retweetedTweet.retweetedTweet,
          userId,
        ); // This will be the retweeted tweet and the the tweet replied to
        retweetedTweet.retweetedTweet = retweetReply;
      }
      newTweets.push(retweetedTweet);
    } else {
      newTweets.push(tweet);
    }
  }
  return newTweets;
};
export const getTweetReply = async (tweet: any, userId: string) => {
  const replyToTweet = await getTweetAndEntitiesById(
    tweet.replyToTweetId as string,
    userId,
  );
  return { ...tweet, replyToTweet };
};
export const getTweetRetweet = async (tweet: any, userId: string) => {
  const retweetedTweet = await getTweetAndEntitiesById(
    tweet.retweetedId as string,
    userId,
  );
  return { ...tweet, retweetedTweet };
};

export const isRetweeted = async (userId: string, tweet: Tweet) => {
  // If the tweet was a retweet, we refer to the original tweet, because retweeting a tweet means retweeting the original tweet
  const retweetedId = tweet?.retweetedId ? tweet.retweetedId : tweet?.id;
  if (!retweetedId || !userId) return null;
  const retweeted = await prisma.tweet.findFirst({
    where: {
      retweetedId,
      userId,
      deletedAt: null,
    },
  });
  return retweeted?.id;
};
export const isLiked = async (userId: string, tweetId: string) => {
  if (!tweetId || !userId) return false;
  const liked = await prisma.like.findFirst({
    where: {
      userId: userId,
      tweetId: tweetId,
    },
  });
  return liked !== null;
};
