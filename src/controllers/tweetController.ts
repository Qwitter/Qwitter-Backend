import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { User } from '@prisma/client';

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
