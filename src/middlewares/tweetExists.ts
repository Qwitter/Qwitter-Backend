import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { getTweetAndUserById } from '../repositories/tweetRepository';

/***
 * Middleware used to check if tweet exists & not deleted given tweet ID
 */
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
