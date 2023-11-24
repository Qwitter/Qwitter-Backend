import { Request, Response, NextFunction, response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { User } from '@prisma/client';
import { AppError } from '../utils/appError';

export const getTimeline = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        replyToTweet: true,
        reTweet: true,
        qouteTweet: true,
        likes: true,
        TweetEntity: true,
      },
      skip,
      take: parsedLimit,
    });

    res.status(200).json({
      tweets: timelineTweets,
    });

    next();
  },
);

export const postTweet = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const currentUser = req.user as User;
    const userId = currentUser.id;
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
        userId: false, // Exclude the 'userId' field
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

    // Extracting entities
    const hashtags = extractHashtags(req.body.text);
    const mentions = extractMentions(req.body.text);
    const urls = extractUrls(req.body.text);
    const media = req.body.media;

    // Creating entities and linking it with tweet

    let entitiesId: string[] = [];
    for (const hashtag of hashtags) {
      const existingHashtag = await prisma.hashtag.findFirst({
        where: {
          text: hashtag,
        },
      });
      if (existingHashtag) {
        await prisma.hashtag.update({
          where: {
            text: hashtag,
          },
          data: {
            count: existingHashtag.count + 1,
          },
        });
      } else {
        await prisma.create;
      }
    }
    const returnedTweet = { ...createdTweet, userName: currentUser.userName };
    return res.status(201).json({
      status: 'success',
      tweet: returnedTweet,
    });
  },
);

function extractHashtags(inputString: string): string[] {
  // Regular expression to find hashtags
  const hashtagRegex = /#(\w+)/g;
  // Use match() to find all occurrences of the hashtag pattern in the input string
  const hashtags = inputString.match(hashtagRegex);
  // If there are hashtags, return them; otherwise, return an empty array
  return hashtags ? hashtags : [];
}
function extractMentions(inputString: string): string[] {
  const mentionRegex = /@(\w+)/g;
  // Use match() to find all occurrences of the mention pattern in the input string
  const mentions = inputString.match(mentionRegex);
  // If there are mentions, return them; otherwise, return an empty array
  return mentions ? mentions : [];
}
function extractUrls(inputString: string): string[] {
  // Regular expression to find URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Use match() to find all occurrences of the URL pattern in the input string
  const urls = inputString.match(urlRegex);
  // If there are URLs, return them; otherwise, return an empty array
  return urls ? urls : [];
}

export const getTweetReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params.id;

    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        TweetEntity: true,
      },
    });

    res.status(200).json({
      status: 'success',
      replies: replies,
    });

    next();
  },
);

export const getTweetRetweets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tweetId = req.params.id;

    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweetId,
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
      },
      include: {
        author: true,
      },
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

    let tweet = await prisma.tweet.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        TweetEntity: true,
      },
    });
    if (tweet?.retweetedId != null) {
      console.log(req.params.id);
      retweetedTweetID = tweet.retweetedId;
      tweet = await prisma.tweet.findFirst({
        where: {
          id: retweetedTweetID,
        },
        include: {
          TweetEntity: true,
        },
      });
    }
    if (!tweet) {
      new AppError('Tweet was Not Found', 404);
    } else if (tweet.deletedAt != null) {
      new AppError('Tweet was deleted', 410);
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
            where: { id: mention?.userId },
          });
          mentions.push({ mentionedUsername: user?.userName });
        }
      }
      const tweetingUser = await prisma.user.findFirst({
        where: { id: tweet.userId },
      });
      const responseBody = {
        status: 'success',
        body: {
          createdAt: tweet.createdAt,
          id: tweet.id,
          userName: tweetingUser?.userName,
          replyCount: tweet.replyCount,
          retweetCount: tweet.retweetCount,
          likesCount: tweet.likesCount,
          text: tweet.text,
          source: tweet.source,
          coordinates: tweet.coordinates,
          replyToTweetId: tweet.replyToTweetId,
          retweetedID: retweetedTweetID,
          entities: {
            hashtags: hashtags,
            media: medias,
            mentions: mentions,
          },
        },
      };
      res.status(200).json(responseBody);
    }
    next();
  },
);
