import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import prisma from '../client';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';

export const isLoggedIn = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Checking if the token is verified.
    const auth_header: string = req.headers.authorization as string;

    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return next(new AppError('Unauthorized access', 401));
    }
    const token: string = auth_header.split(' ')[1];
    const payloadData = verify(token, process.env.JWT_SECRET as string);
    if (!(payloadData as JwtPayload).id) {
      return next(new AppError('Invalid access credentials', 409));
    }
    if (
      ((payloadData as JwtPayload).exp as number) <=
      parseInt((Date.now() / 1000).toString())
    ) {
      return next(new AppError('Token Expired', 409));
    }
    const user = await prisma.user.findFirst({
      where: {
        id: (payloadData as JwtPayload).id,
      },
    });

    req.user = user as User;
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    return next();
  },
);

export const mobileLoggedIn = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Checking if the token is verified.
    const auth_header: string = req.headers.authorization as string;

    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return next(new AppError('Unauthorized access', 401));
    }
    const token: string = auth_header.split(' ')[1];
    const payloadData = verify(token, process.env.JWT_SECRET as string);
    if (
      !(payloadData as JwtPayload).id &&
      !(payloadData as JwtPayload).google_id
    ) {
      return next(new AppError('Invalid access credentials', 409));
    }
    if (
      ((payloadData as JwtPayload).exp as number) <=
      parseInt((Date.now() / 1000).toString())
    ) {
      return next(new AppError('Token Expired', 409));
    }
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: (payloadData as JwtPayload).id },
          { google_id: (payloadData as JwtPayload).google_id },
        ],
      },
    });

    req.user = user as User;
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    return next();
  },
);
