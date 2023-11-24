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
    }
); 