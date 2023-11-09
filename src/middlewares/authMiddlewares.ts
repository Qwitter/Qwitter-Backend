import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { jwtPayloadType } from 'jwt-types';
// import { AppError } from '../utils/appError';
import prisma from '../database/prismaClient';
import { catchAsync } from '../utils/catchAsync';
export const jwtVerifyAsync = (token: string, secret: string) => {
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
    const auth_header: string = req.headers.authorization as string;
    
    if (!auth_header || !auth_header.startsWith('Bearer')) {
      // return next(new AppError('Invalid token ', 400));
      _res.send({message:"Invalid token"}).status(400)
    }
    else{
    const token: string = auth_header.split(' ')[1];
    const payloadData = await jwtVerifyAsync(
      token,
      process.env.JWT_SECRET as string,
      );
    const { id } = payloadData as jwtPayloadType;
    req.body.userId = id;
    const user = await prisma.user.findFirst({
      where: {
        id: req.body.id,
      },
    });
    if (!user) {
      // return next(new AppError('User not found ', 404));
      _res.json({message:"User not found"}).status(404)

    }}
    next();
  },
);