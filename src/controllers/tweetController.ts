import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { User } from '@prisma/client';
import { AppError } from '../utils/appError';
import {
  createEntityTweet,
  createHashtag,
  createMedia,
  createMention,
  getMention,
  getTweetEntities,
} from '../repositories/entityRepository';
import { incrementHashtagCount } from '../repositories/entityRepository';
import { createEntity } from '../repositories/entityRepository';
import { getUserByUsername } from '../repositories/userRepository';
import { getTweetAndUserById } from '../repositories/tweetRepository';


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
          }
        },
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
    // const urls = extractUrls(req.body.text);
    // const media = req.body.media;

    // Creating entities and linking it with tweet

    let entitiesId: string[] = [];

    // Processing Hashtags
    for (const hashtag of hashtags) {
      let entityId: string = '';
      const existingHashtag = await prisma.hashtag.findFirst({
        where: {
          text: hashtag,
        },
      });
      if (existingHashtag) {
        await incrementHashtagCount(hashtag);
        entityId = existingHashtag.entityId;
      } else {
        const newEntity = await createEntity('hashtag');
        entityId = newEntity.id;
        await createHashtag(entityId, hashtag);
      }
      entitiesId.push(entityId);
    }

    // Processing Mentions

    for (const mention of mentions) {
      let entityId: string = '';
      const existingUser = await getUserByUsername(mention);
      if (!existingUser) continue;
      const existingMention = await getMention(existingUser.id);
      if (existingMention) {
        entityId = existingMention.entityId;
      } else {
        const newMention = await createMention(existingUser.id);
        entityId = newMention.entityId;
      }
      entitiesId.push(entityId);
    }
    // Processing Media Upload if any
    const files = (req.files as Express.Multer.File[]) || [];
    const fileNames = files?.map((file: { filename: string }) => file.filename);
    for (const fileName of fileNames) {
      const createdMedia = await createMedia(fileName);
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
    let originalTweeter=null;
    let {tweet,tweetingUser} = await getTweetAndUserById(req.params.id);
    originalTweeter=tweetingUser?.userName
    if (tweet?.retweetedId != null) {
      retweetedTweetID = tweet.retweetedId;
      let tempRetweet = (await getTweetAndUserById(retweetedTweetID))
      tweetingUser=tempRetweet.tweetingUser
      tweet=tempRetweet.tweet
    }
    if (!tweet) {
      new AppError('Tweet was Not Found', 404);
    } else if (tweet.deletedAt != null) {
      new AppError('Tweet was deleted', 410);
    }
    else if(!tweetingUser)
    {
      new AppError('user account was deleted', 404);
    } 
    else {
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
      const liked=await prisma.like.findFirst({
        where:{
          userId:(req.user as User)?.id,
          tweetId:req.params.id
        }
      })
  
      const responseBody = {
        status: 'success',
          tweet:{
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
            liked:liked!=null,
            bookmarked:false,
            entities: {
              hashtags: hashtags,
              media: medias,
              mentions: mentions,
            },
          },
          user:{
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
          }
      };
      res.status(200).json(responseBody);
    }
    next();
  },
);

export const getTweetLikers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const tweetLikers = await prisma.like.findMany({
      where: {
        tweetId: id,
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
    });

    const likers = tweetLikers.map((like) => like.liker);

    res.status(200).json({
      status: 'success',
      likers,
    });

    next();
  },
);



