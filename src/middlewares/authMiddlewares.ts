import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import prisma from '../client';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';

/**
 * middleware to check if user is logged in
  * check if auth token exists, valid token, not expired & user already exists for this jwt
  * otherwise return error identifying the opposed error
 */
export const isLoggedIn = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Checking if the token is verified.
    const auth_header: string =
      req.cookies.qwitter_jwt || (req.headers.authorization as string);

    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return next(new AppError('Unauthorized access', 401));
    }
    const token: string = auth_header.split(' ')[1];
    const payloadData = await verify(token, process.env.JWT_SECRET as string);
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
        deletedAt: null,
      },
    });
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    req.user = user as User;
    return next();
  },
);

/***
 * middleware to check if user is logged in for mobile application
  * check if auth token exists, valid token, not expired & user already exists for this jwt
  * otherwise return error identifying the opposed error
 */
export const mobileLoggedIn = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Checking if the token is verified.
    const auth_header: string =
      req.cookies.qwitter_jwt || (req.headers.authorization as string);
    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return next(new AppError('Unauthorized access', 401));
    }
    const token: string = auth_header.split(' ')[1];
    const payloadData =await verify(token, process.env.JWT_SECRET as string);
    if (!(payloadData as JwtPayload).email) {
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
        email: (payloadData as JwtPayload).email.toLowerCase(),
        deletedAt: null,
      },
    });

    req.user = user as User;
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    return next();
  },
);

/***
  * middleware that passes user if no auth token provided or if it's provided AND valid
    * used when visitng users' profile (that doesn't require full user authentications)
 */
export const authenticate = catchAsync(
  // Does not return an error if the token is not provided
  async (req: Request, _res: Response, next: NextFunction) => {
    // Checking if the token is verified.
    const auth_header: string =
      req.cookies.qwitter_jwt || (req.headers.authorization as string);

    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return next();
    }
    const token: string = auth_header.split(' ')[1];
    const payloadData = await verify(token, process.env.JWT_SECRET as string);
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
        deletedAt: null,
      },
    });
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    req.user = user as User;
    return next();
  },
);
