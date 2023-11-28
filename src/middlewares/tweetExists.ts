import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { getTweetAndUserById } from '../repositories/tweetRepository';

export const tweetExists = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    const tweet = await getTweetAndUserById(id);
    if (!tweet) {
      return next(new AppError('Tweet does not exist', 404));
    }
    next();
  },
);
