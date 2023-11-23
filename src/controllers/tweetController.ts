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
    }
); 



export const getTweet=catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
  let medias=[]
  let hashtags=[]
  let mentions=[]
  let retweetedTweetID=null
  
  let tweet=await prisma.tweet.findFirst(
    {
      where:{
        id:req.params.id
      },
      include:{
        TweetEntity:true,
      }
    }
  )
  if(tweet?.retweetedId!=null)
  {
    console.log(req.params.id)
    retweetedTweetID=tweet.retweetedId
    tweet=await prisma.tweet.findFirst({
      where:{
        id:retweetedTweetID
      },
      include:{
        TweetEntity:true,
      }
    })
  }
  if(!tweet)
  {
    new AppError('Tweet was Not Found', 404)
  }
  else if(tweet.deletedAt!=null)
  {
    new AppError('Tweet was deleted', 410)
  }
  else{

    const tweetEntities=tweet?.TweetEntity
    for(var entity of tweetEntities)
    {
      let tempEnitity=await prisma.entity.findFirst({where:{id:entity.entityId}})
      if(tempEnitity?.type=="hashtag")
      {
       let hashtag= await prisma.hashtag.findFirst({where:{entityId:entity.entityId}})
       hashtags.push({value:hashtag?.text})
      }
      else if(tempEnitity?.type=="media")
      {
       let media= await prisma.media.findFirst({where:{entityId:entity.entityId}})
       medias.push({value:media?.url,type:media?.type})
      }
      else{
        let mention=await prisma.mention.findFirst({where:{entityId:entity.entityId}})
        let user=await prisma.user.findFirst({where:{id:mention?.userId}})
        mentions.push({mentionedUsername:user?.userName})
      }
    }
    const tweetingUser=await prisma.user.findFirst({where:{id:tweet.userId}})
    const responseBody={
      status:"success",
      body:{
        createdAt:tweet.createdAt,
        id:tweet.id,
        userName:tweetingUser?.userName,
        replyCount:tweet.replyCount,
        retweetCount:tweet.retweetCount,
        likesCount:tweet.likesCount,
        text:tweet.text,
        source:tweet.source,
        coordinates:tweet.coordinates,
        replyToTweetId:tweet.replyToTweetId,
        retweetedID:retweetedTweetID,
        entities:{
          hashtags:hashtags,
          media:medias,
          mentions:mentions
        }
      },
    }
    res.status(200).json(responseBody)
  }
  next()
})