import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { User } from '@prisma/client';
import { AppError } from '../utils/appError';
import {
  createEntityTweet,
  createMedia,
  extractEntities,
  getTweetEntities,
  searchHastagsByWord,
} from '../repositories/entityRepository';
import {
  getTweetsCreatedByUser,
  getUserByUsername,
  isUserFollowing,
} from '../repositories/userRepository';
import {
  deleteTweetById,
  getTweetAndUserById,
  getTweetsLikedById,
  searchTweet,
  getTweetsMediaById,
  getTweetById,
  incrementReplies,
  incrementRetweet,
  incrementLikes,
  getTweetsRepliesRetweets,
  isRetweeted,
} from '../repositories/tweetRepository';
import { authorSelectOptions } from '../types/user';

const getTimeline = async (req: Request) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const following = await prisma.follow.findMany({
    where: {
      folowererId: userId,
    },
    select: {
      followedId: true,
    },
  });

  const followingIds = following.map((follow) => follow.followedId);

  followingIds.push(userId);

  const { page = '1', limit = '10' } = req.query;
  const parsedPage = parseInt(page as string, 10);
  const parsedLimit = parseInt(limit as string, 10);

  const skip = (parsedPage - 1) * parsedLimit;

  const timelineTweets = await prisma.tweet.findMany({
    where: {
      userId: {
        in: followingIds,
      },
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: authorSelectOptions,
      },
      likes: true,
    },
    skip,
    take: parsedLimit,
  });

  let responses = [];
  for (var tweet of timelineTweets) {
    const liked = await prisma.like.findFirst({
      where: {
        userId: (req.user as User)?.id,
        tweetId: tweet.id,
      },
    });
    const entities = await getTweetEntities(tweet.id);
    const isFollowing = await isUserFollowing(
      (req.user as User).id,
      tweet.userId,
    );
    const isRetweetedBoolean = await isRetweeted(
      (req.user as User)?.id,
      tweet.id,
    );
    let response = {
      ...tweet,
      entities,
      liked: liked != null,
      isFollowing,
      isRetweeted: isRetweetedBoolean,
    };
    responses.push(response);
  }

  // return responses;
  return getTweetsRepliesRetweets(responses);
};

export const getForYouTimeline = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const currentUser = req.user as User;
    const userId = currentUser.id;
    const following = await prisma.follow.findMany({
      where: {
        folowererId: userId,
      },
      select: {
        followedId: true,
      },
    });

    const followingIds = following.map((follow) => follow.followedId);

    followingIds.push(userId);

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const topHashtags = await prisma.hashtag.findMany({
      take: 20,
      orderBy: {
        count: 'desc',
      },
    });

    const timelineTweets = await prisma.tweet.findMany({
      where: {
        OR: [
          {
            userId: {
              in: followingIds,
            },
            deletedAt: null,
          },
          ...topHashtags.map((hashtag) => ({
            text: {
              contains: hashtag.text,
            },
          })),
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
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
        replyToTweet: true,
        reTweet: true,
        qouteTweet: true,
        likes: true,
      },
      skip,
      take: parsedLimit,
    });

    let responses = [];
    for (var tweet of timelineTweets) {
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: tweet.id,
        },
      });
      const entities = await getTweetEntities(tweet.id);
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        tweet.userId,
      );
      let response = {
        ...tweet,
        entities,
        liked: liked != null,
        isFollowing,
      };
      responses.push(response);
    }

    res.json({
      status: 'success',
      tweets: responses,
    });
  },
);

export const postTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as User;
    const userId = currentUser.id;
    // Check that both are not sent
    if (req.body.replyToTweetId && req.body.retweetedId) {
      return next(new AppError('Can not retweet and reply together', 401));
    }

    // Check for replyToTweetId
    if (req.body.replyToTweetId) {
      const tweet = await getTweetById(req.body.replyToTweetId);
      if (!tweet) {
        return next(new AppError('Invalid replyToTweetId', 401));
      } else {
        await incrementReplies(req.body.replyToTweetId);
      }
    }
    // Check for replyToTweet and retweet
    if (req.body.retweetedId) {
      const tweet = await getTweetById(req.body.retweetedId);
      if (!tweet) {
        return next(new AppError('Invalid retweetId', 401));
      } else {
        await incrementRetweet(req.body.retweetedId);
      }
    }
    const createdTweet = await prisma.tweet.create({
      data: {
        text: req.body.text,
        createdAt: new Date().toISOString(),
        source: req.body.source,
        coordinates: req.body.coordinates,
        replyToTweetId: req.body.replyToTweetId
          ? req.body.replyToTweetId
          : null,
        retweetedId: req.body.retweetedId ? req.body.retweetedId : null,
        userId: userId,
      },
      select: {
        createdAt: true,
        id: true,
        text: true,
        source: true,
        coordinates: true,
        replyToTweetId: true,
        replyCount: true,
        retweetedId: true,
        retweetCount: true,
        qouteTweetedId: true,
        qouteCount: true,
        likesCount: true,
        sensitive: true,
        deletedAt: true,
      },
    });

    const entitiesId = await extractEntities(req.body.text);
    // Processing Media Upload if any
    const files = (req.files as Express.Multer.File[]) || [];
    const fileNames = files?.map((file: { filename: string }) => file.filename);
    for (const fileName of fileNames) {
      const createdMedia = await createMedia(fileName, 'tweet');
      entitiesId.push(createdMedia.entityId);
    }

    // Linking Entities with Tweets
    for (const id of entitiesId) {
      await createEntityTweet(createdTweet.id, id);
    }

    const entities = await getTweetEntities(createdTweet.id);
    const returnedTweet = {
      ...createdTweet,
      userName: currentUser.userName,
      entities,
    };
    return res.status(201).json({
      status: 'success',
      tweet: returnedTweet,
    });
  },
);

// function extractUrls(inputString: string): string[] {
//   // Regular expression to find URLs
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   // Use match() to find all occurrences of the URL pattern in the input string
//   const urls = inputString.match(urlRegex);
//   // If there are URLs, return them; otherwise, return an empty array
//   return urls ? urls : [];
// }

export const getTweetReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params.id;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;
    let responses = [];
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
        deletedAt: null,
      },
    });

    if (!tweet) {
      res.status(404).json({
        status: 'error',
        message: 'Tweet not found',
      });
      return;
    }

    const replies = await prisma.tweet.findMany({
      where: {
        replyToTweetId: tweetId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: authorSelectOptions,
        },
      },
      skip,
      take: parsedLimit,
    });
    for (var reply of replies) {
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: reply.id,
        },
      });
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        tweet.userId,
      );
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        tweet.id,
      );
      let response = {
        ...reply,
        liked: liked != null,
        isFollowing,
        isRetweeted: isRetweetedBoolean,
      };
      responses.push(response);
    }

    res.status(200).json({
      status: 'success',
      replies: responses,
    });

    next();
  },
);

export const getTweetRetweets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params.id;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
        deletedAt: null,
      },
    });

    if (!tweet) {
      res.status(404).json({
        status: 'error',
        message: 'Tweet not found',
      });
      return;
    }

    const retweeters = await prisma.tweet.findMany({
      where: {
        retweetedId: tweetId,
        deletedAt: null,
      },
      include: {
        author: { select: authorSelectOptions },
      },
      skip,
      take: parsedLimit,
    });

    res.status(200).json({
      status: 'success',
      retweeters: retweeters?.map((retweet) => retweet.author as User),
    });

    next();
  },
);

export const getTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let medias = [];
    let hashtags = [];
    let mentions = [];
    let retweetedTweetID = null;
    let originalTweeter = null;
    let { tweet, tweetingUser } = await getTweetAndUserById(req.params.id);
    originalTweeter = tweetingUser?.userName;
    if (tweet?.retweetedId != null) {
      retweetedTweetID = tweet.retweetedId;
      let tempRetweet = await getTweetAndUserById(retweetedTweetID);
      tweetingUser = tempRetweet.tweetingUser;
      tweet = tempRetweet.tweet;
    }
    if (!tweet) {
      new AppError('Tweet was Not Found', 404);
    } else if (tweet.deletedAt != null) {
      new AppError('Tweet was deleted', 410);
    } else if (!tweetingUser) {
      new AppError('user account was deleted', 404);
    } else {
      const tweetEntities = tweet?.TweetEntity;
      for (var entity of tweetEntities) {
        let tempEnitity = await prisma.entity.findFirst({
          where: { id: entity.entityId },
        });
        if (tempEnitity?.type == 'hashtag') {
          let hashtag = await prisma.hashtag.findFirst({
            where: { entityId: entity.entityId },
          });
          hashtags.push({ value: hashtag?.text });
        } else if (tempEnitity?.type == 'media') {
          let media = await prisma.media.findFirst({
            where: { entityId: entity.entityId },
          });
          medias.push({ value: media?.url, type: media?.type });
        } else {
          let mention = await prisma.mention.findFirst({
            where: { entityId: entity.entityId },
          });
          let user = await prisma.user.findFirst({
            where: { id: mention?.userId, deletedAt: null },
          });
          mentions.push({ mentionedUsername: user?.userName });
        }
      }
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: req.params.id,
        },
      });

      const responseBody = {
        status: 'success',
        tweet: {
          createdAt: tweet.createdAt,
          id: tweet.id,
          userName: originalTweeter,
          replyCount: tweet.replyCount,
          retweetCount: tweet.retweetCount,
          likesCount: tweet.likesCount,
          text: tweet.text,
          source: tweet.source,
          coordinates: tweet.coordinates,
          replyToTweetId: tweet.replyToTweetId,
          retweetedID: retweetedTweetID,
          liked: liked != null,
          entities: {
            hashtags: hashtags,
            media: medias,
            mentions: mentions,
          },
        },
        user: {
          userName: tweetingUser.userName,
          name: tweetingUser.name,
          birthDate: tweetingUser.birthDate,
          url: tweetingUser.url,
          description: tweetingUser.description,
          protected: tweetingUser.protected,
          verified: tweetingUser.verified,
          followersCount: tweetingUser.followersCount,
          followingCount: tweetingUser.followingCount,
          createdAt: tweetingUser.createdAt,
          profileBannerUrl: tweetingUser.profileBannerUrl,
          profileImageUrl: tweetingUser.profileImageUrl,
          email: tweetingUser.email.toLowerCase(),
        },
      };
      res.status(200).json(responseBody);
    }
    next();
  },
);

export const deleteTweet = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    await deleteTweetById(req.params.id);
    return res.status(204).json({
      message: 'Tweet deleted',
    });
  },
);

export const getTweetLikers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;
    const { id } = req.params;

    const tweet = await prisma.tweet.findUnique({
      where: { id: id },
    });

    if (!tweet) {
      res.status(404).json({
        message: 'Tweet is not Found',
      });
      return next();
    }

    const tweetLikers = await prisma.like.findMany({
      where: {
        tweetId: id,
        liker: { deletedAt: null },
      },
      include: {
        liker: {
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
      skip,
      take: parsedLimit,
    });

    const likers = tweetLikers.map((like) => like.liker);

    res.status(200).json({
      status: 'success',
      likers,
    });

    next();
  },
);

export const searchTweets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, hashtag, page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;
    let responses = [];
    let tweets;
    if (hashtag) {
      tweets = await searchTweet(
        null,
        (hashtag as string).trim(),
        skip,
        parsedLimit,
      );
    } else if (q) {
      tweets = await searchTweet((q as string).trim(), null, skip, parsedLimit);
    } else {
      tweets = await getTimeline(req);
    }
    for (var tweet of tweets) {
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: tweet.id,
        },
      });
      const tweeterUserID = (await getUserByUsername(tweet.author.userName))
        ?.id;
      if (!tweeterUserID) continue;
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        tweeterUserID,
      );
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        tweet.id,
      );
      let response = {
        ...tweet,
        liked: liked != null,
        isFollowing,
        isRetweeted: isRetweetedBoolean,
      };
      responses.push(response);
    }
    res.status(200).json({ tweets: responses });
    next();
  },
);
export const getUserTweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userName } = req.params;

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;
    let responses = [];
    const user = await getUserByUsername(userName);
    // Checking that the user exists
    if (!user) {
      return res.status(404).json({
        tweets: [],
        message: 'User Not found',
      });
    }
    const tweets = await getTweetsCreatedByUser(user.id, skip, parsedLimit);
    for (var tweet of tweets) {
      if (tweet.replyToTweetId != null) continue;
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: tweet.id,
        },
      });
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        tweet.userId,
      );
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        tweet.id,
      );
      let response = {
        ...tweet,
        liked: liked != null,
        isFollowing,
        isRetweeted: isRetweetedBoolean,
      };
      responses.push(response);
    }
    responses = await getTweetsRepliesRetweets(responses);
    return res.status(200).json({
      tweets: responses,
    });
  },
);

export const getUserReplies = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userName } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;
    let responses = [];
    const user = await getUserByUsername(userName);
    // Checking that the user exists
    if (!user) {
      return res.status(404).json({
        tweets: [],
        message: 'User Not found',
      });
    }
    const tweets = await getTweetsCreatedByUser(user.id, skip, parsedLimit);
    for (var tweet of tweets) {
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: tweet.id,
        },
      });
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        tweet.userId,
      );
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        tweet.id,
      );
      let response = {
        ...tweet,
        liked: liked != null,
        isFollowing,
        isRetweeted: isRetweetedBoolean,
      };
      responses.push(response);
    }
    responses = await getTweetsRepliesRetweets(responses);
    return res.status(200).json({
      tweets: responses,
    });
  },
);

export const searchHastags = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { q } = req.params;
    const hashtags = await searchHastagsByWord(q);
    return res.status(200).json(hashtags);
  },
);
export const getUserLikedTweets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userName = req.params.username;

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const user = await getUserByUsername(userName);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    const tweets = await getTweetsLikedById(
      (user as User).id as string,
      skip,
      parsedLimit,
    );
    const responses = await getTweetsRepliesRetweets(tweets);
    res.status(200).json({ tweets: responses });
    next();
  },
);

export const getUserMediaTweets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userName = req.params.username;

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const user = await getUserByUsername(userName);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    const tweets = await getTweetsMediaById(
      (user as User).id as string,
      skip,
      parsedLimit,
    );
    const responses = await getTweetsRepliesRetweets(tweets);
    res.status(200).json({ tweets: responses });
    next();
  },
);

export const likeTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const likerId = (req.user as User).id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: { userId: likerId, tweetId: id },
        liker: { deletedAt: null },
      },
    });

    const existingTweet = await prisma.tweet.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (existingLike || !existingTweet) {
      return next(new AppError("Tweet is already liked or doesn't exist", 400));
    }

    await prisma.like.create({
      data: {
        userId: likerId,
        tweetId: id,
      },
    });
    await incrementLikes(id);
    // TODO: Add here send a notification using the function in utils/notification
    res.status(200).json({ status: 'success' });
    next();
  },
);

export const unlikeTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const likerId = (req.user as User).id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: { userId: likerId, tweetId: id },
        liker: { deletedAt: null },
      },
    });

    const existingTweet = await prisma.tweet.findUnique({
      where: { id },
    });
    if (!existingLike || !existingTweet) {
      return next(new AppError("Tweet is not liked or doesn't exist", 400));
    }
    await incrementLikes(id, -1);

    await prisma.like.delete({
      where: {
        userId_tweetId: { userId: likerId, tweetId: id },
        liker: { deletedAt: null },
      },
    });

    res.status(200).json({ status: 'success' });
    next();
  },
);
