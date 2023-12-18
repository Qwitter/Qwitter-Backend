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
  isUserBlocked,
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
  getTweetAndEntitiesById,
} from '../repositories/tweetRepository';
import { authorSelectOptions } from '../types/user';

const getTimeline = async (req: Request) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const following = await prisma.follow.findMany({
    where: {
      folowererId: userId,
      followed: {
        blocked: { none: { blocker: { id: currentUser.id } } },
        blocker: { none: { blocked: { id: currentUser.id } } },
        muted: { none: { muter: { id: currentUser.id } } },
      },
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
      author:{
        muted:{none:{muterId:currentUser.id}}
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
        followed: {
          blocked: { none: { blocker: { id: currentUser.id } } },
          blocker: { none: { blocked: { id: currentUser.id } } },
        },
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
            author:{
              muted:{none: {muterId:currentUser.id}}
            }
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
        author: {
          select: authorSelectOptions,
        },
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
      entities,
    };
    const structuredTweets = await getTweetsRepliesRetweets([returnedTweet]);
    const structuredTweet = {
      ...structuredTweets[0],
      liked: false,
      isRetweeted: false,
      isFollowing: false,
    };
    return res.status(201).json({
      status: 'success',
      tweet: structuredTweet,
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
  async (req: Request, res: Response, _next: NextFunction) => {
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
  },
);

export const getTweetRetweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
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
    const authUser=req.user as User

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
    let retweetersMapped=retweeters?.map((retweet) => retweet.author as User)
    let retweetersPromises=await retweetersMapped?.map( async(retweeter) => {
      let retweetUser= await getUserByUsername(retweeter.userName)
      let isFollowing=  await isUserFollowing(authUser.id as string,retweetUser?.id as string)
      return{retweeter,isFollowing:isFollowing}
    })
    
    let retweetersRes=await Promise.all(retweetersPromises)
    res.status(200).json({
      status: 'success',
      retweeters: retweetersRes,
    });
  },
);

export const getTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { tweetingUser } = await getTweetAndUserById(req.params.id);

    const tweet = await getTweetAndEntitiesById(req.params.id);
    const structuredTweets = await getTweetsRepliesRetweets([tweet]);
    const structuredTweet = structuredTweets[0];

    let isBlocking = false;
    let isBlocked = false;
    if (req.user && tweetingUser) {
      isBlocking = await isUserBlocked(
        (req.user as User).id,
        (tweetingUser as User).id,
      );
      isBlocked = await isUserBlocked(
        (tweetingUser as User).id,
        (req.user as User).id,
      );
    }
    if (!tweet || isBlocked || isBlocking) {
      return next(new AppError('Tweet was Not Found', 404));
    } else if (tweet.deletedAt != null) {
      return next(new AppError('Tweet was deleted', 410));
    } else if (!tweetingUser) {
      return next(new AppError('user account was deleted', 404));
    }

    const liked = await prisma.like.findFirst({
      where: {
        userId: (req.user as User)?.id,
        tweetId: req.params.id,
      },
    });

    const responseBody = {
      status: 'success',
      tweet: { ...structuredTweet, liked },
    };
    return res.status(200).json(responseBody);
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
  async (req: Request, res: Response, _next: NextFunction) => {
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
    

    const authUser=req.user as User

    const likers = tweetLikers.map((like) => like.liker);
    let likersPromises=await likers?.map( async(liker) => {
      let likerUser= await getUserByUsername(liker.userName)
      let isFollowing=  await isUserFollowing(authUser.id as string,likerUser?.id as string)
      return{liker,isFollowing:isFollowing}
    })
    
    let likersRes=await Promise.all(likersPromises)

    res.status(200).json({
      status: 'success',
      likersRes,
    });
  },
);

export const searchTweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
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
        req.user as User,
      );
    } else if (q) {
      tweets = await searchTweet(
        (q as string).trim(),
        null,
        skip,
        parsedLimit,
        req.user as User,
      );
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
    if (
      (await isUserBlocked((req.user as User).id, user.id)) ||
      (await isUserBlocked(user.id, (req.user as User).id))
    ) {
      return res.status(403).json({
        message: 'Blocked',
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
    if (
      (await isUserBlocked((req.user as User).id, user.id)) ||
      (await isUserBlocked(user.id, (req.user as User).id))
    ) {
      return res.status(403).json({
        message: 'Blocked',
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
  async (req: Request, res: Response, _next: NextFunction) => {
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
    if (
      (await isUserBlocked((req.user as User).id, user.id)) ||
      (await isUserBlocked(user.id, (req.user as User).id))
    ) {
      return res.status(403).json({
        message: 'Blocked',
      });
    }
    const tweets = await getTweetsLikedById(
      (user as User).id as string,
      skip,
      parsedLimit,
    );
    const responses = await getTweetsRepliesRetweets(tweets);
    return res.status(200).json({ tweets: responses });
  },
);

export const getUserMediaTweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
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
    if (
      (await isUserBlocked((req.user as User).id, user.id)) ||
      (await isUserBlocked(user.id, (req.user as User).id))
    ) {
      return res.status(403).json({
        message: 'Blocked',
      });
    }
    const tweets = await getTweetsMediaById(
      (user as User).id as string,
      skip,
      parsedLimit,
    );
    const responses = await getTweetsRepliesRetweets(tweets);
    return res.status(200).json({ tweets: responses });
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
  },
);
