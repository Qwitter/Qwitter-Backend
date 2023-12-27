import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { Tweet, User } from '@prisma/client';
import { AppError } from '../utils/appError';
import {
  createEntityTweet,
  createMedia,
  extractEntities,
  getTweetEntities,
  searchHastagsByWord,
} from '../repositories/entityRepository';
import {
  getNumOfTweets,
  getTweetsCreatedByUser,
  getUserByID,
  getUserByUsername,
  isUserBlocked,
  isUserFollowing,
  isUserMuted,
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
  getTweetsMentionedById,
} from '../repositories/tweetRepository';
import { authorSelectOptions } from '../types/user';
import { newTweetNotification, sendNotification } from '../utils/notifications';

/**
 * gets the timeline tweets for users in paginated form by checking on the followings list of the user
 * orders the tweets in chronological order
 */

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

  const followingIds = following?.map((follow) => follow.followedId) || [];

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
      author: {
        muted: { none: { muterId: currentUser.id } },
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
    const isRetweetedBoolean = await isRetweeted((req.user as User)?.id, tweet);
    let response = {
      ...tweet,
      entities,
      liked: liked != null,
      isFollowing,
      currentUserRetweetId: isRetweetedBoolean,
      tweetCount: await getNumOfTweets(tweet.author.userName),
    };
    responses.push(response);
  }

  // return responses;
  return getTweetsRepliesRetweets(responses, userId);
};

/**
 * get the tweets of for you page the difference with respect to getTimeline is that the tweets are independent somewhat of the user follow list
 * return status 200 and a list of tweets
 */

export const getForYouTimeline = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const currentUser = req.user as User;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;
    const tweets = await prisma.tweet.findMany({
      where: {
        deletedAt: null,
        author: {
          blocked: { none: { blocker: { id: currentUser.id } } },
          blocker: { none: { blocked: { id: currentUser.id } } },
          muted: { none: { muter: { id: currentUser.id } } },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
        id: true,
        text: true,
        source: true,
        coordinates: true,
        readCount: true,
        replyToTweetId: true,
        replyCount: true,
        retweetedId: true,
        retweetCount: true,
        qouteTweetedId: true,
        qouteCount: true,
        likesCount: true,
        sensitive: true,
        author: { select: authorSelectOptions },
        likes: true,
      },
      skip,
      take: parsedLimit,
    });
    const ret = [];
    for (const tweet of tweets) {
      let { tweetingUser } = await getTweetAndUserById(tweet.id);
      const entities = await getTweetEntities(tweet.id);
      let structuredTweet = await getTweetAndEntitiesById(
        tweet.id,
        currentUser.id,
      );
      const structuredTweets = await getTweetsRepliesRetweets(
        [tweet],
        currentUser.id,
      );
      structuredTweet = structuredTweets[0];
      const liked = await prisma.like.findFirst({
        where: {
          userId: currentUser.id,
          tweetId: tweet.id,
        },
      });
      const isFollowing = await isUserFollowing(
        currentUser.id,
        (tweetingUser as User).id,
      );
      const IsRetweeted = await isRetweeted(
        currentUser.id,
        structuredTweet as Tweet,
      );
      const isMuted = await isUserMuted(
        (req.user as User).id,
        (tweetingUser as User).id,
      );
      ret.push({
        ...structuredTweet,
        entities,
        liked: liked ? true : false,
        isFollowing,
        isMuted,
        currentUserRetweetId: IsRetweeted,
        tweetCount: await getNumOfTweets(
          structuredTweet.author?.userName as string,
        ),
      });
    }

    const responseBody = {
      status: 'success',
      resultsCount: tweets.length,
      tweets: ret,
    };
    return res.status(200).json(responseBody);
  },
);

/**
 * for tweet creation
 * checks the request body in case the send object had replyToTweetId and retweetedId if so it returns status 401 and message Can not retweet and reply together
 * checks the request body in case it was a reply for a non existing tweet if so it returns 401 and message Invalid replyToTweetId
 * checks the request body in case it was a retweet for a non existing tweet if so it returns 401 and message Invalid replyToTweetId
 * checks if the user is retweeting a retweet if so returns 401 and message Can not retweet twice
 * if the request passed all the previous conditions it starts the tweet creation process by first querying the database
 * then it fetches the attached files with the request body and links the tweet with its files
 * after creating the tweet, creating the right notification process commences
 * for example in case of retweet and reply it notifies the original tweeter
 * in case of mention it notifies the mentioned
 */

export const postTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as User;
    const userId = currentUser.id;
    let retweetId = req.body.retweetedId;
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
    if (retweetId) {
      const tweet = await getTweetById(retweetId);
      if (!tweet) {
        return next(new AppError('Invalid retweetId', 401));
      }
      // Checking that this tweet was a retweet for another tweet to return the original tweet
      // When you retweet a tweet, you retweet the original tweet
      if (tweet.retweetedId) retweetId = tweet.retweetedId;
      // You can not retweet a tweet twice
      const retweetedBefore = await isRetweeted(userId, tweet);
      if (retweetedBefore) {
        return next(new AppError('Can not retweet twice', 401));
      }
      await incrementRetweet(retweetId);
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
        readCount: true,
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
      const createdMedia = await createMedia(fileName, 'tweet/');
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
    const structuredTweets = await getTweetsRepliesRetweets(
      [returnedTweet],
      userId,
    );
    const structuredTweet = {
      ...structuredTweets[0],
      liked: false,
      isRetweeted: false,
      isFollowing: false,
    };
    //TODO: add reply notification
    if (
      req.body.replyToTweetId &&
      structuredTweet.replyToTweet.author.userName != currentUser.userName
    ) {
      const notification = await prisma.notification.create({
        data: {
          createdAt: new Date(),
          senderId: (req.user as User).id,
          objectId: structuredTweet.id,
          type: 'reply',
        },
      });
      const tempUser = await prisma.user.findUnique({
        where: {
          userName: structuredTweet.replyToTweet.author.userName,
        },
      });
      await prisma.recieveNotification.create({
        data: {
          notificationId: notification.id,
          recieverId: (tempUser as User).id,
        },
      });
      const notificationObject = {
        type: 'reply',
        createdAt: new Date(),
        reply: structuredTweet,
      };
      sendNotification(tempUser as User, notificationObject);
    }
    //TODO: add retweet notification
    if (
      req.body.retweetedId &&
      structuredTweet.retweetedTweet.author.userName != currentUser.userName
    ) {
      const notification = await prisma.notification.create({
        data: {
          createdAt: new Date(),
          senderId: (req.user as User).id,
          objectId: structuredTweet.id,
          type: 'retweet',
        },
      });
      const tempUser = await prisma.user.findUnique({
        where: {
          userName: structuredTweet.retweetedTweet.author.userName,
        },
      });
      await prisma.recieveNotification.create({
        data: {
          notificationId: notification.id,
          recieverId: (tempUser as User).id,
        },
      });
      const notificationObject = {
        type: 'retweet',
        createdAt: new Date(),
        retweet: structuredTweet,
      };
      sendNotification(tempUser as User, notificationObject);
    }
    //TODO: add followers notification for the new post

    const notification = await prisma.notification.create({
      data: {
        createdAt: new Date(),
        senderId: (req.user as User).id,
        objectId: structuredTweet.id,
        type: 'post',
      },
    });
    const followers =
      (await prisma.follow.findMany({
        where: { followedId: (req.user as User).id },
      })) || [];
    for (let follower of followers) {
      await prisma.recieveNotification.create({
        data: {
          notificationId: notification.id,
          recieverId: follower.folowererId,
        },
      });
      const notificationObject = {
        type: 'post',
        createdAt: new Date(),
        post: structuredTweet,
      };
      const followerUser = (await getUserByID(follower.followedId)) as User;
      if (followerUser.userName !== currentUser.userName)
        sendNotification(followerUser, notificationObject);
    }

    // Mentions Notifications
    if (entities.mentions.length > 0) {
      await prisma.notification.create({
        data: {
          createdAt: new Date(),
          senderId: (req.user as User).id,
          objectId: structuredTweet.id,
          type: 'mention',
        },
      });
      const mentions = entities.mentions;
      for (let userName of mentions) {
        const user = await getUserByUsername(userName);
        if (user)
          await prisma.recieveNotification.create({
            data: {
              notificationId: notification.id,
              recieverId: user.id,
            },
          });
      }
    }
    newTweetNotification();
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

/**
 * for getting the replies of the indicated tweet
 * check that the passed tweetID refers to an actual tweet if not it send status 404 and message Tweet not found
 * if it passed the checked it fetches the corresponding replies in chronological order with their corresponding authors
 * then it send the replies with status 200
 */

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

    const replies =
      (await prisma.tweet.findMany({
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
      })) || [];
    for (var reply of replies) {
      const liked = await prisma.like.findFirst({
        where: {
          userId: (req.user as User)?.id,
          tweetId: reply.id,
        },
      });
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        reply.userId,
      );
      const isMuted = await isUserMuted((req.user as User).id, tweet.userId);
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        reply,
      );
      const entities = await getTweetEntities(reply.id);
      let response = {
        ...reply,
        entities,
        liked: liked != null,
        isFollowing,
        isMuted,
        currentUserRetweetId: isRetweetedBoolean,
        tweetCount: await getNumOfTweets(reply.author.userName),
      };
      responses.push(response);
    }
    res.status(200).json({
      status: 'success',
      replies: responses,
    });
  },
);

/**
 * for getting the retweeters of the indicated tweet
 * check that the passed tweetID refers to an actual tweet if not it send status 404 and message Tweet not found
 * if it passed it fetches the retweeters with code 200
 */

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
    const authUser = req.user as User;

    const retweeters =
      (await prisma.tweet.findMany({
        where: {
          retweetedId: tweetId,
          deletedAt: null,
        },
        include: {
          author: { select: authorSelectOptions },
        },
        skip,
        take: parsedLimit,
      })) || [];
    let retweetersMapped = retweeters?.map((retweet) => retweet.author as User);
    let retweetersPromises = await retweetersMapped?.map(async (retweeter) => {
      let retweetUser = await getUserByUsername(retweeter.userName);
      let isFollowing = await isUserFollowing(
        authUser.id as string,
        retweetUser?.id as string,
      );
      return { ...retweeter, isFollowing: isFollowing };
    });

    let retweetersRes = await Promise.all(retweetersPromises);
    res.status(200).json({
      status: 'success',
      retweeters: retweetersRes,
    });
  },
);
/**
 * for fetching a specific tweet
 * it checks first if the tweet exists or the authinticating user is blocked by the author or vice versa if any of these conditions are true it returns status 404 and message Tweet Not Found
 * it further checks if the tweet was deleted it return status 410 and Tweet was deleted
 * it checks that the user was not deleted if so it return 404 and message user account was deleted
 * if it passed the previous conditions it returns the tweet with additional information including whether the auth user is followed or muted by the requesting user
 * it also returns whether the tweet was retweed is so it returns the correct authors
 */
export const getTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { tweetingUser } = await getTweetAndUserById(req.params.id);

    const tweet = await getTweetAndEntitiesById(
      req.params.id,
      tweetingUser?.id as string,
    );
    const structuredTweets = await getTweetsRepliesRetweets(
      [tweet],
      tweetingUser?.id as string,
    );
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
    const tempUser = await prisma.user.findUnique({
      where: {
        userName: structuredTweet.author.userName,
      },
    });
    const isFollowing = await isUserFollowing(
      (req.user as User)?.id,
      (tempUser as User).id,
    );
    const IsRetweeted = await isRetweeted(
      (req.user as User)?.id,
      structuredTweet,
    );
    const isMuted = await isUserMuted(
      (req.user as User).id,
      (tweetingUser as User).id,
    );
    const responseBody = {
      status: 'success',
      tweet: {
        ...structuredTweet,
        liked: liked ? true : false,
        isFollowing,
        isMuted,
        currentUserRetweetId: IsRetweeted,
        tweetCount: await getNumOfTweets(structuredTweet.author.userName),
      },
    };
    return res.status(200).json(responseBody);
  },
);

/**
 * for deleting a specific tweet
 * it simply deletes the tweet
 */

export const deleteTweet = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    await deleteTweetById(req.params.id);
    return res.status(204).json({
      message: 'Tweet deleted',
    });
  },
);

/**
 * get the likers of a certian tweet
 * it checks whether the tweet really exists if not it sends 404 with message Tweet is not Found
 * if it passed it send the likers with relevant information with status 200
 */

export const getTweetLikers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const authUser = req.user as User;
    const skip = (parsedPage - 1) * parsedLimit;
    const { id } = req.params;

    const tweet = await prisma.tweet.findUnique({
      where: { id: id },
    });

    if (!tweet) {
      return res.status(404).json({
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
      },
      skip,
      take: parsedLimit,
    });

    const likers = tweetLikers?.map((like) => like.liker) || [];
    const ret: object[] = [];
    for (let liker of likers) {
      const isFollowing = await isUserFollowing(authUser.id, liker.id);
      const isBlocked = await isUserBlocked(authUser.id, liker.id);
      const isMuted = await isUserMuted(authUser.id, liker.id);
      const { id, ...temp } = liker;
      ret.push({
        ...temp,
        isFollowing,
        isBlocked: isBlocked,
        isMuted: isMuted,
      });
    }

    return res.status(200).json({
      status: 'success',
      likers: ret,
    });
  },
);

/**
 * for search for tweets with relevant content to that of the queried word
 * it returns the relevant tweets in paginated form with the corresponding relevant data
 */

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
        tweet,
      );
      let response = {
        ...tweet,
        liked: liked != null,
        isFollowing,
        currentUserRetweetId: isRetweetedBoolean,
        tweetCount: await getNumOfTweets(tweet.author.userName),
      };
      responses.push(response);
    }
    res.status(200).json({ tweets: responses, resultsCount: tweets.length });
  },
);

/**
 * for getting that tweets authored by a specific user it first checks that the user actually exists if not it send 404 with error message
 * it also makes sure there is no block relation between the two users the requesting one and the requested one
 * if it passed it gets the corresponding tweets in paginated form and status 200
 */
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
      return _next(new AppError('User Not found', 404));
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
      const isMuted = await isUserMuted((req.user as User).id, tweet.userId);
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        tweet,
      );
      let response = {
        ...tweet,
        liked: liked != null,
        isFollowing,
        isMuted,
        currentUserRetweetId: isRetweetedBoolean,
        tweetCount: await getNumOfTweets(tweet.author.userName),
      };
      responses.push(response);
    }
    responses = await getTweetsRepliesRetweets(responses, user.id);
    return res.status(200).json({
      tweets: responses,
    });
  },
);

/**
 * for getting that replies authored by a specific user it first checks that the user actually exists if not it send 404 with error message
 * it also makes sure there is no block relation between the two users the requesting one and the requested one
 * if it passed it gets the corresponding tweets in paginated form and status 200
 */
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
      return _next(new AppError('User Not found', 404));
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
      if (tweet.replyToTweetId == null) continue;
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
      const isMuted = await isUserMuted((req.user as User).id, tweet.userId);
      const isRetweetedBoolean = await isRetweeted(
        (req.user as User)?.id,
        tweet,
      );
      let response = {
        ...tweet,
        liked: liked != null,
        isFollowing,
        isMuted,
        currentUserRetweetId: isRetweetedBoolean,
        tweetCount: await getNumOfTweets(tweet.author.userName),
      };
      responses.push(response);
    }
    responses = await getTweetsRepliesRetweets(responses, user.id);
    const filteredResponses = [];
    for (const tweet of responses) {
      if (tweet.replyToTweetId && !tweet.replyToTweet) continue;
      filteredResponses.push(tweet);
    }
    return res.status(200).json({
      tweets: filteredResponses,
    });
  },
);

/**
 * gets hashtag that are relevenat to the queried word
 * it returns an list of hashtags with status 200
 */

export const searchHastags = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { q } = req.query;
    const hashtags = await searchHastagsByWord(q as string | null);
    return res.status(200).json(hashtags);
  },
);

/**
 * for getting that likes done by a specific user it first checks that the user actually exists if not it send 404 with error message
 * it also makes sure there is no block relation between the two users the requesting one and the requested one
 * if it passed it gets the corresponding tweets in paginated form and status 200
 */

export const getUserLikedTweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userName = req.params.username;

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const user = await getUserByUsername(userName);

    if (!user) {
      return _next(new AppError('User Not found', 404));
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
    const responses = await getTweetsRepliesRetweets(tweets, user.id);
    return res.status(200).json({ tweets: responses });
  },
);
export const getUserMentionedTweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const user = req.user as User;
    const tweets = await getTweetsMentionedById(
      (user as User).id as string,
      skip,
      parsedLimit,
      user,
    );

    const responses = await getTweetsRepliesRetweets(tweets, user.id);
    return res.status(200).json({ tweets: responses });
  },
);
/**
 * for getting the media created by a specific user it first checks that the user actually exists if not it send 404 with error message
 * it also makes sure there is no block relation between the two users the requesting one and the requested one
 * if it passed it gets the corresponding tweets in paginated form and status 200
 */

export const getUserMediaTweets = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userName = req.params.username;
    const authUser = req.user as User;

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const user = await getUserByUsername(userName);

    if (!user) {
      return _next(new AppError('User Not found', 404));
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
      authUser,
    );
    const responses = await getTweetsRepliesRetweets(
      tweets,
      (req.user as User).id,
    );
    return res.status(200).json({ tweets: responses });
  },
);

/**
 * for liking a tweet
 * it checks if the tweet is deleted or already liked if so it return 400 and error message
 * else it creates the tweet and notifies the author of the tweet
 */

export const likeTweet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const authUser = req.user as User;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: { userId: authUser.id, tweetId: id },
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
        userId: authUser.id,
        tweetId: id,
      },
    });
    await incrementLikes(id);

    //TODO: add like notification
    const createdTweet = await prisma.tweet.findFirst({
      where: {
        id: id,
        deletedAt: null,
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
        readCount: true,
        sensitive: true,
        deletedAt: true,
        author: {
          select: authorSelectOptions,
        },
      },
    });

    const entities = await getTweetEntities(createdTweet?.id as string);
    const returnedTweet = {
      ...createdTweet,
      entities,
    };
    const structuredTweets = await getTweetsRepliesRetweets(
      [returnedTweet],
      authUser.id,
    );

    const liked = await getUserByUsername(
      createdTweet?.author.userName as string,
    );
    const isBlocked = await isUserBlocked((liked as User).id, authUser.id);
    const isBlocking = await isUserBlocked(authUser.id, (liked as User).id);

    const IsRetweeted = await isRetweeted(
      (liked as User).id,
      structuredTweets[0],
    );

    const isLiked = await prisma.like.findFirst({
      where: {
        userId: (liked as User).id,
        tweetId: createdTweet?.id as string,
      },
    });

    const structuredTweet = {
      ...structuredTweets[0],
      liker: {
        userName: authUser.userName,
        name: authUser.name,
        url: authUser.url,
        description: authUser.description,
        followersCount: authUser.followersCount,
        followingCount: authUser.followingCount,
        profileImageUrl: authUser.profileImageUrl,
        isFollowing: await isUserFollowing(liked?.id as string, authUser.id),
        isBlocked: isBlocked || isBlocking,
        isMuted: false,
        tweetCount: await getNumOfTweets((req.user as User).userName),
      },
      liked: isLiked ? true : false,
      currentUserRetweetId: IsRetweeted,
    };

    if (authUser.userName !== createdTweet?.author.userName) {
      // Checking that the liker is not the author
      const notification = await prisma.notification.create({
        data: {
          createdAt: new Date(),
          senderId: authUser.id,
          objectId: id,
          type: 'like',
        },
      });

      await prisma.recieveNotification.create({
        data: {
          notificationId: notification.id,
          recieverId: existingTweet.author.id,
        },
      });
      const notificationObject = {
        type: 'like',
        createdAt: new Date(),
        like: structuredTweet,
      };

      sendNotification(existingTweet.author, notificationObject);
    }
    res.status(200).json({ status: 'success' });
  },
);

/**
 * for removing a like of a tweet
 * it checks if the tweet is deleted or already not liked if so it return 400 and error message
 * it returns 200 success message
 */

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
