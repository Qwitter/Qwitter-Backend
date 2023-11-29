import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';
import {
  getUserByUsername,
  blockUserByIDs,
  getUserBlocked,
  unblockUserByIDs,
  getBlockedUsersByID,
} from '../repositories/userRepository';
import prisma from '../client';
import fs from 'fs';

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
export const deleteProfileBanner = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const user = _req.user as User;
    const imageUrl = user.profileBannerUrl as string;
    const trimmedString = imageUrl.substring(imageUrl.indexOf('/')); // Trims the server path
    await fs.unlink('./public/' + trimmedString, (err) => {
      if (err) {
        res.status(404).send({
          message: 'File not found',
        });
      }
      res.status(200).send({
        message: 'File is deleted.',
      });
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileBannerUrl: '',
      },
    });
  },
);
export const deleteProfilePicture = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const user = _req.user as User;
    const imageUrl = user.profileImageUrl as string;
    const trimmedString = imageUrl.substring(imageUrl.indexOf('/')); // Trims the server path
    await fs.unlink('./public/' + trimmedString, (err) => {
      if (err) {
        res.status(404).send({
          message: 'File not found',
        });
      }
      res.status(200).send({
        message: 'File is deleted.',
      });
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileImageUrl: '',
      },
    });
  },
);
export const getUser = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: {
        userName: _req.params.username,
      },
    });
    //const { id,google_id,password,passwordChangedAt,passwordResetToken,passwordResetExpires,deletedAt, ...resposeObject } = user;
    if (user) {
      const resposeObject = {
        userName: user.userName,
        name: user.name,
        birthDate: user.birthDate,
        url: user.url,
        description: user.description,
        protected: user.protected,
        verified: user.verified,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        createdAt: user.createdAt,
        profileBannerUrl: user.profileBannerUrl,
        profileImageUrl: user.profileImageUrl,
        email: user.email.toLowerCase(),
      };
      res.json(resposeObject).status(200);
    } else {
      return _next(new AppError('User not found', 404));
    }
  },
);

export const getRequestingUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = req.user as User;
    const resposeObject = {
      userName: user.userName,
      name: user.name,
      birthDate: user.birthDate,
      url: user.url,
      description: user.description,
      protected: user.protected,
      verified: user.verified,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: user.createdAt,
      profileBannerUrl: user.profileBannerUrl,
      profileImageUrl: user.profileImageUrl,
      email: user.email.toLowerCase(),
    };
    res.status(200).json({ user: resposeObject });
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

export const getUserFollowers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id;
    const followers = await prisma.follow.findMany({
      where: {
        followedId: userId,
      },
      include: {
        follower: true,
      },
    });

    res.status(200).json(followers);
    next();
  },
);

export const putUserProfile = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const user = _req.user as User;
    const updatedUser = await prisma.user.update({
      where: {
        userName: user.userName,
      },
      data: {
        name: _req.body.name,
        description: _req.body.description,
        location: _req.body.location,
        url: _req.body.url,
        birthDate: _req.body.birth_date,
      },
    });
    const {
      id,
      google_id,
      password,
      passwordChangedAt,
      passwordResetToken,
      passwordResetExpires,
      deletedAt,
      ...resposeObject
    } = updatedUser;
    res.status(200).json(resposeObject);
  },
);

export const getBlockedUsers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const blockedUsers = await getBlockedUsersByID((_req.user as User).id);
    res.json(blockedUsers).status(200);
  },
);

export const blockUser = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const blockingUser = _req.user as User;
    const blockedUser = await getUserByUsername(
      _req.params.username.toLowerCase(),
    );
    if (!blockedUser) {
      return _next(new AppError('user not found', 404));
    } else if (await getUserBlocked(blockingUser?.id, blockedUser.id)) {
      return _next(new AppError('user already blocked', 404));
    } else {
      const block = await blockUserByIDs(blockingUser.id, blockedUser.id);
      if (block) {
        res.json({ status: 'success' }).status(200);
      } else {
        res.json({ status: 'success' }).status(404);
      }
    }
    _next();
  },
);

export const unblockUser = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const blockingUser = _req.user as User;
    const blockedUser = await getUserByUsername(
      _req.params.username.toLowerCase(),
    );
    if (!blockedUser) {
      return _next(new AppError('user not found', 404));
    } else if (!(await getUserBlocked(blockingUser?.id, blockedUser.id))) {
      return _next(new AppError('user not blocked', 404));
    } else {
      const block = await unblockUserByIDs(blockingUser.id, blockedUser.id);
      if (block) {
        res.json({ status: 'success' }).status(200);
      } else {
        res.json({ status: 'failute' }).status(404);
      }
    }
    _next();
  },
);

export const muteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const muterId = (req.user as User).id;

    const userToMute = await prisma.user.findUnique({
      where: { userName: username },
    });

    if (!userToMute) {
      return next(new AppError('User to mute not found', 404));
    }

    if (muterId == userToMute.id) {
      return next(new AppError("Can't Mute Yourself", 401));
    }

    const existingMute = await prisma.mute.findUnique({
      where: { muterId_mutedId: { muterId, mutedId: userToMute.id } },
    });

    if (existingMute) {
      return next(new AppError('User is already muted', 400));
    }

    await prisma.mute.create({
      data: {
        muterId,
        mutedId: userToMute.id,
      },
    });

    res
      .status(200)
      .json({ status: 'success', message: 'User muted successfully' });
    next();
  },
);

export const unmuteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const muterId = (req.user as User).id;

    const userToUnmute = await prisma.user.findUnique({
      where: { userName: username },
    });

    if (!userToUnmute) {
      return next(new AppError('User to unmute not found', 404));
    }

    if (muterId == userToUnmute.id) {
      return next(new AppError("Can't Unmute Yourself", 401));
    }

    const existingMute = await prisma.mute.findUnique({
      where: { muterId_mutedId: { muterId, mutedId: userToUnmute.id } },
    });

    if (!existingMute) {
      return next(new AppError('User is not muted', 400));
    }

    await prisma.mute.delete({
      where: { muterId_mutedId: { muterId, mutedId: userToUnmute.id } },
    });

    res
      .status(200)
      .json({ status: 'success', message: 'User unmuted successfully' });
    next();
  },
);

export const getUsersMutedByCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const muterId = (req.user as User).id;

    const mutedUsers = await prisma.mute.findMany({
      where: {
        muterId,
      },
      include: {
        muted: true,
      },
    });

    res.status(200).json(mutedUsers.map((user) => user.muted));
    next();
  },
);

export const followUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const followerId = (req.user as User).id;

    const userToFollow = await prisma.user.findUnique({
      where: { userName: username },
    });

    if (!userToFollow) {
      return next(new AppError('User to follow not found', 404));
    }

    if (userToFollow.id == followerId) {
      return next(new AppError("Can't follow youself", 401));
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        folowererId_followedId: {
          folowererId: followerId,
          followedId: userToFollow.id,
        },
      },
    });

    if (existingFollow) {
      return next(new AppError('User is already followed', 400));
    }

    await prisma.follow.create({
      data: {
        folowererId: followerId,
        followedId: userToFollow.id,
      },
    });

    res
      .status(200)
      .json({ status: 'success', message: 'User followed successfully' });
    next();
  },
);

export const unfollowUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const followerId = (req.user as User).id;

    const userToUnfollow = await prisma.user.findUnique({
      where: { userName: username },
    });

    if (!userToUnfollow) {
      return next(new AppError('User to unfollow not found', 404));
    }

    if (userToUnfollow.id == followerId) {
      return next(new AppError("Can't unfollow youself", 401));
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        folowererId_followedId: {
          folowererId: followerId,
          followedId: userToUnfollow.id,
        },
      },
    });

    if (!existingFollow) {
      return next(new AppError('User is not followed', 400));
    }

    await prisma.follow.delete({
      where: {
        folowererId_followedId: {
          folowererId: followerId,
          followedId: userToUnfollow.id,
        },
      },
    });

    res
      .status(200)
      .json({ status: 'success', message: 'User unfollowed successfully' });
    next();
  },
);
