import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';
// import { JwtPayload, verify } from 'jsonwebtoken';

export const uploadProfilePicture = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(200).json({
      message: 'Image uploaded successfully',
    });
  },
);

export const getUser=catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const recievedUser=_req.user as User
    const { id,google_id,password,passwordChangedAt,passwordResetToken,passwordResetExpires,deletedAt, ...resposeObject } = recievedUser;
    res.json(resposeObject).status(200)

  }

)
