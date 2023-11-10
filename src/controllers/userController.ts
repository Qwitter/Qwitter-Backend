import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';
import prisma from '../client';
// import { JwtPayload, verify } from 'jsonwebtoken';

export const uploadProfilePicture = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const photoName = _req.file?.filename;
    if (!photoName) {
      return _next(
        new AppError('An error occurred while uploading profile picture', 500),
      );
    }
    const user = _req.user as User;
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileImageUrl: `${process.env.URL}/imgs/user${_req.url}/${photoName}`,
      },
    });
    return res.status(200).json({
      message: 'Image uploaded successfully',
      user: updatedUser,
    });
  },
);
export const uploadProfileBanner = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const photoName = _req.file?.filename;
    if (!photoName) {
      return _next(
        new AppError('An error occurred while uploading profile picture', 500),
      );
    }
    const user = _req.user as User;
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileBannerUrl: `${process.env.URL}/imgs/user${_req.url}/${photoName}`,
      },
    });
    return res.status(200).json({
      message: 'Image uploaded successfully',
      user: updatedUser,
    });
  },
);

export const getUser = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const recievedUser = _req.user as User;
    const {
      id,
      google_id,
      password,
      passwordChangedAt,
      passwordResetToken,
      passwordResetExpires,
      deletedAt,
      ...resposeObject
    } = recievedUser;
    res.json(resposeObject).status(200);
  },
);

export const changeUserName = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const newUserName = req.body.userName;
    const userCheck = await prisma.user.findFirst({
      where: {
        userName: newUserName,
      },
    });
    if (userCheck) {
      return _next(new AppError('UserName already exists', 409));
    }
    const user = req.user as User;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        userName: newUserName,
      },
    });
    _res.status(200).json({
      message: 'userName was updated successfully',
    });
    return _next();
  },
);
