import { Request, Response, NextFunction } from 'express';
import prisma from '../client';
import { Tweet, User } from '@prisma/client';
import { getTweetEntities } from '../repositories/entityRepository';
import {
  getTweetsRepliesRetweets,
  isRetweeted,
} from '../repositories/tweetRepository';
import {
  getNumOfTweets,
  getUserByID,
  isUserBlocked,
  isUserFollowing,
} from '../repositories/userRepository';
import { authorSelectOptions } from '../types/user';

export const getNotification = async (
  req: Request,
  res: Response,
  __: NextFunction,
) => {
  const authUser = req.user as User;
  const { page = '1', limit = '10' } = req.query;
  const parsedPage = parseInt(page as string, 10);
  const parsedLimit = parseInt(limit as string, 10);

  const skip = (parsedPage - 1) * parsedLimit;

  const notifications = await prisma.recieveNotification.findMany({
    where: { recieverId: authUser.id },
    orderBy: {
      Notification: {
        createdAt: 'desc',
      },
    },
    include: {
      Notification: {},
    },
    skip,
    take: parsedLimit,
  });

  const parsedNotifications = [];
  for (const notification of notifications) {
    if (notification.Notification.type == 'reply') {
      const createdTweet = await prisma.tweet.findFirst({
        where: { id: notification.Notification.objectId as string },
        include: { author: { select: authorSelectOptions } },
      });
      const entities = await getTweetEntities((createdTweet as Tweet).id);
      const returnedTweet = {
        ...createdTweet,
        entities,
      };
      const structuredTweets = await getTweetsRepliesRetweets([returnedTweet]);
      const tempUser = await prisma.user.findUnique({
        where: {
          userName: structuredTweets[0].replyToTweet.author.userName,
        },
      });
      const isFollowing = await isUserFollowing(
        authUser.id,
        (tempUser as User).id,
      );
      const liked = await prisma.like.findFirst({
        where: {
          userId: authUser.id,
          tweetId: structuredTweets[0].id,
        },
      });
      const IsRetweeted = await isRetweeted(
        authUser.id,
        structuredTweets[0].id,
      );
      const structuredTweet = {
        ...structuredTweets[0],
        liked: liked ? true : false,
        isRetweeted: IsRetweeted,
        isFollowing,
      };
      const replyNotificationObject = {
        type: notification.Notification.type,
        createdAt: notification.Notification.createdAt,
        reply: structuredTweet,
      };
      parsedNotifications.push(replyNotificationObject);
    } else if (notification.Notification.type == 'retweet') {
      const createdTweet = await prisma.tweet.findFirst({
        where: { id: notification.Notification.objectId as string },
        include: { author: { select: authorSelectOptions } },
      });
      const entities = await getTweetEntities((createdTweet as Tweet).id);
      const returnedTweet = {
        ...createdTweet,
        entities,
      };
      console.log(returnedTweet);
      const structuredTweets = await getTweetsRepliesRetweets([returnedTweet]);

      const tempUser = await prisma.user.findUnique({
        where: {
          userName: structuredTweets[0].retweetedTweet.author.userName,
        },
      });
      const isFollowing = await isUserFollowing(
        authUser.id,
        (tempUser as User).id,
      );
      const liked = await prisma.like.findFirst({
        where: {
          userId: authUser.id,
          tweetId: structuredTweets[0].id,
        },
      });
      const IsRetweeted = await isRetweeted(
        authUser.id,
        structuredTweets[0].id,
      );
      const structuredTweet = {
        ...structuredTweets[0],
        liked: liked ? true : false,
        isRetweeted: IsRetweeted,
        isFollowing,
      };
      const retweetNotificationObject = {
        type: notification.Notification.type,
        createdAt: notification.Notification.createdAt,
        retweet: structuredTweet,
      };
      parsedNotifications.push(retweetNotificationObject);
    } else if (notification.Notification.type == 'login') {
      const loginNotificationObject = {
        type: notification.Notification.type,
        createdAt: notification.Notification.createdAt,
      };
      parsedNotifications.push(loginNotificationObject);
    } else if (notification.Notification.type == 'follow') {
      const follower = await getUserByID(notification.Notification.senderId);
      const isBlocked = await isUserBlocked((follower as User).id, authUser.id);
      const isBlocking = await isUserBlocked(
        authUser.id,
        (follower as User).id,
      );
      const followNotificationObject = {
        type: notification.Notification.type,
        createdAt: notification.Notification.createdAt,
        follower: {
          userName: (follower as User).userName,
          name: (follower as User).name,
          url: (follower as User).url,
          description: (follower as User).description,
          followersCount: (follower as User).followersCount,
          followingCount: (follower as User).followingCount,
          profileImageUrl: (follower as User).profileImageUrl,
          isFollowing: await isUserFollowing(
            authUser.id,
            (follower as User).id,
          ),
          isBlocked: isBlocked || isBlocking,
          isMuted: false,
          tweetCount: await getNumOfTweets((follower as User).userName),
        },
      };
      parsedNotifications.push(followNotificationObject);
    } else if (notification.Notification.type == 'post') {
      const createdTweet = await prisma.tweet.findFirst({
        where: {
          id: notification.Notification.objectId as string,
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
      const structuredTweets = await getTweetsRepliesRetweets([returnedTweet]);
      const structuredTweet = {
        ...structuredTweets[0],
        liked: false,
        isRetweeted: false,
        isFollowing: false,
      };
      const postNotificationObject = {
        type: notification.Notification.type,
        createdAt: notification.Notification.createdAt,
        post: structuredTweet,
      };
      parsedNotifications.push(postNotificationObject);
    } else if (notification.Notification.type == 'like') {
      const createdTweet = await prisma.tweet.findFirst({
        where: {
          id: notification.Notification.objectId as string,
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
      const structuredTweets = await getTweetsRepliesRetweets([returnedTweet]);

      const liker = (await getUserByID(
        notification.Notification.senderId,
      )) as User;

      const isBlocked = await isUserBlocked(authUser.id, liker.id);
      const isBlocking = await isUserBlocked(liker.id, authUser.id);

      const IsRetweeted = await isRetweeted(authUser.id, authUser.id);

      const isLiked = await prisma.like.findFirst({
        where: {
          userId: authUser.id,
          tweetId: createdTweet?.id as string,
        },
      });

      const structuredTweet = {
        ...structuredTweets[0],
        liker: {
          userName: (req.user as User).userName,
          name: (req.user as User).name,
          url: (req.user as User).url,
          description: (req.user as User).description,
          followersCount: (req.user as User).followersCount,
          followingCount: (req.user as User).followingCount,
          profileImageUrl: (req.user as User).profileImageUrl,
          isFollowing: await isUserFollowing(authUser.id, liker.id),
          isBlocked: isBlocked || isBlocking,
          isMuted: false,
          tweetCount: await getNumOfTweets((req.user as User).userName),
        },
        liked: isLiked ? true : false,
        isRetweeted: IsRetweeted,
        isFollowing: false,
      };

      const likeNotificationObject = {
        type: notification.Notification.type,
        createdAt: notification.Notification.createdAt,
        like: structuredTweet,
      };
      parsedNotifications.push(likeNotificationObject);
    } else {
      continue;
    }
  }
  res.status(200).json({ notifications: parsedNotifications });
};
