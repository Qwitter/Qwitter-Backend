import { Tweet } from '@prisma/client';
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
        deletedAt: null,
      },
    });
  }
  return { tweet: tweet, tweetingUser: user };
};
export const getTweetAndEntitiesById = async (tweetId: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
      deletedAt: null,
    },
    include: {
      author: {
        select: {
          name: true,
          location: true,
          url: true,
          description: true,
          protected: true,
          verified: true,
          followersCount: true,
          followingCount: true,
          createdAt: true,
          profileBannerUrl: true,
          profileImageUrl: true,
          email: true,
          userName: true,
          birthDate: true,
        },
      },
    },
  });
  const entities = await getTweetEntities(tweetId);
  return { ...tweet, entities };
};
export const getTweetById = async (tweetId: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
      deletedAt: null,
    },
  });

  return tweet;
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
export const getTweetsRepliesRetweets = async (tweets: Tweet[]) => {
  let newTweets = [];
  for (const tweet of tweets) {
    if (tweet.replyToTweetId) {
      newTweets.push(await getTweetReply(tweet));
    } else if (tweet.retweetedId) {
      let retweetedTweet = await getTweetRetweet(tweet); // This the is the original tweet + The retweeted tweet
      if (retweetedTweet.retweetedTweet.replyToTweetId) {
        // If the retweeted is a reply
        let retweetReply = await getTweetReply(retweetedTweet.retweetedTweet); // This will be the retweeted tweet and the the tweet replied to
        retweetedTweet.retweetedTweet = retweetReply;
      }
      newTweets.push(retweetedTweet);
    } else {
      newTweets.push(tweet);
    }
  }
  return newTweets;
};
export const getTweetReply = async (tweet: any) => {
  const replyToTweet = await getTweetAndEntitiesById(
    tweet.replyToTweetId as string,
  );
  return { ...tweet, replyToTweet };
};
export const getTweetRetweet = async (tweet: any) => {
  const retweetedTweet = await getTweetAndEntitiesById(
    tweet.retweetedId as string,
  );
  return { ...tweet, retweetedTweet };
};
