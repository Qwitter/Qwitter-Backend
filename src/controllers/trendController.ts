import { Request, Response, NextFunction } from 'express';
import prisma from '../client';

export const getTrends = async (_: Request, res: Response, __: NextFunction) => {
    const topHashtags = await prisma.hashtag.findMany({
        take: 20,
        orderBy: {
            count: 'desc',
        },
    }) || [];

    res.status(200).json({
        status: 'success',
        trends: topHashtags.map((hashtag) => ({
            trend: hashtag.text,
            count: hashtag.count,
        })),
    });
};
  