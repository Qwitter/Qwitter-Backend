import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { jwtPayloadType } from 'jwt-types';
import { AppError } from '../utils/appError';
import prisma from '../database/prismaClient';
import { catchAsync } from '../utils/catchAsync';
const jwtVerifyAsync = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    verify(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};
export const isLoggedIn = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Checking if the token is verified.
    const auth_header: string = req.headers.authorization;

    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return next(new AppError('Invalid token ', 400));
    }
    const token: string = req.headers.authorization.split(' ')[1];
    const payloadData = await jwtVerifyAsync(token, process.env.JWT_SECRET);
    const { id } = payloadData as jwtPayloadType;
    req.body.userId = id;
    const user = await prisma.user.findFirst({
      where: {
        id: req.body.id,
      },
    });
    if (!user) {
      return next(new AppError('User not found ', 404));
    }
    next();
  },
);
