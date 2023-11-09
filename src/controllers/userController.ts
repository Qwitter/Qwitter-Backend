import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const uploadProfilePicture = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(200).json({
      message: 'Image uploaded successfully',
    });
  },
);
