import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';
import { JwtPayload, verify } from 'jsonwebtoken';

import {
  getUserByUsername,
  blockUserByIDs,
  getUserBlocked,
  unblockUserByIDs,
  getBlockedUsersByID,
  getUsersByName,
  getNumOfTweets,
  isUserFollowing,
  getUserByID,
  isUserBlocked,
  isUserMuted,
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
    const url = process.env.url?.startsWith('http')
      ? process.env.URL
      : 'http://' + process.env.URL;
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileImageUrl: `${url}/imgs/user${_req.url}/${photoName}`,
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

    // const currentUser = _req.user as User;
    const auth_header: string =
    _req.cookies.qwitter_jwt || (_req.headers.authorization as string);
    const token: string = auth_header.split(' ')[1];
    const payloadData = await verify(token, process.env.JWT_SECRET as string);
    const authUser = await prisma.user.findFirst({
      where: {
        id: (payloadData as JwtPayload).id,
        deletedAt: null,
      },
    });

    const isFollowing = authUser!=null
      ? await isUserFollowing(
        authUser.id,
          (await getUserByUsername(_req.params.username))?.id || '',
        )
      : false;
    const isBlcoked = authUser!=null
      ? await isUserBlocked(
        authUser.id,
          (await getUserByUsername(_req.params.username))?.id || '',
        )
      : false;
    const isMuted = authUser!=null
      ? await isUserMuted(
        authUser.id,
          (await getUserByUsername(_req.params.username))?.id || '',
        )
      : false;
    

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
        tweetCount: await getNumOfTweets(user.userName),
        isFollowing,
        isBlcoked,
        isMuted
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
      tweetCount: await getNumOfTweets(user.userName),
    };
    return res.status(200).json(resposeObject);
  },
);

export const getUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query.q;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const users = await getUsersByName(query as string, skip, parsedLimit);

    const ret: object[] = [];

    for (let user of users) {
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        (await getUserByUsername(user.userName))?.id || '',
      );
      const tweetCount = await getNumOfTweets(user.userName);
      ret.push({
        ...user,
        tweetCount,
        isFollowing,
      });
    }
    return res.status(200).json({
      users: ret,
    });
  },
);

export const changeUserName = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const newUserName = req.body.userName;
    const userCheck = await prisma.user.findFirst({
      where: {
        userName: newUserName,
        deletedAt: null,
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
  async (req: Request, res: Response, _next: NextFunction) => {
    const userName = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        userName: userName,
      },
    });
    const userId = user?.id;
    if (!user) return _next(new AppError('user not found', 404));

    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const followers = await prisma.follow.findMany({
      where: {
        followedId: userId,
      },
      include: {
        follower: {
          select: {
            userName: true,
            name: true,
            birthDate: true,
            url: true,
            description: true,
            protected: true,
            verified: true,
            followersCount: true,
            followingCount: true,
            createdAt: true,
            profileBannerUrl: true,
            profileImageUrl: true,
            email: true,
          },
        },
      },
      skip,
      take: parsedLimit,
    });

    const resultArray = [];
    for (const el of followers) {
      const user = await getUserByID(el.folowererId);
      const followerId = user ? user.id : '';
      const isFollowing = await isUserFollowing(
        (req.user as User).id,
        followerId,
      );
      const resultObject = {
        ...el.follower,
        tweetCount: await getNumOfTweets(el.follower.userName),
        isFollowing,
      };

      resultArray.push(resultObject);
    }
    res.status(200).json(resultArray);
  },
);

export const getUserFollowings = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userName = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        userName: userName,
      },
    });
    const userId = user?.id;
    if (!user) return _next(new AppError('user not found', 404));
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const followings = await prisma.follow.findMany({
      where: {
        folowererId: userId,
      },
      include: {
        followed: {
          select: {
            userName: true,
            name: true,
            birthDate: true,
            url: true,
            description: true,
            protected: true,
            verified: true,
            followersCount: true,
            followingCount: true,
            createdAt: true,
            profileBannerUrl: true,
            profileImageUrl: true,
            email: true,
          },
        },
      },
      skip,
      take: parsedLimit,
    });

    res.status(200).json(
      await Promise.all(
        followings.map(async (el) => {
          const isFollowing = true;
          return {
            ...el.followed,
            tweetCount: await getNumOfTweets(el.followed.userName),
            isFollowing,
          };
        }),
      ),
    );
  },
);

export const putUserProfile = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    if(_req.body.url)
    {
      if(!((_req.body.url as String).indexOf('.')>0) || !((_req.body.url as String).startsWith("http")) )
        return _next(new AppError('invalid url', 401));
    }
    else{
      _req.body.url=null
    }
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
    res.status(200).json({
      ...resposeObject,
      tweetCount: await getNumOfTweets(resposeObject.userName),
    });
  },
);

export const getBlockedUsers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const blockedUsers = await getBlockedUsersByID((_req.user as User).id);
    res
      .json(
        await Promise.all(
          blockedUsers.map(async (el) => {
            return { ...el, tweetCount: await getNumOfTweets(el.userName) };
          }),
        ),
      )
      .status(200);
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
      where: { userName: username, deletedAt: null },
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
      where: { userName: username, deletedAt: null },
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
  async (req: Request, res: Response, _: NextFunction) => {
    const muterId = (req.user as User).id;
    const { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const skip = (parsedPage - 1) * parsedLimit;

    const mutedUsers = await prisma.mute.findMany({
      where: {
        muterId,
      },
      include: {
        muted: true,
      },
      skip,
      take: parsedLimit,
    });

    res.status(200).json(
      await Promise.all(
        mutedUsers
          .map((user) => user.muted)
          .map(async (el) => {
            const isFollowing = await isUserFollowing(
              (req.user as User).id,
              el.id,
            );
            return {
              ...el,
              tweetCount: await getNumOfTweets(el.userName),
              isFollowing,
            };
          }),
      ),
    );
  },
);

export const followUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const followerId = (req.user as User).id;

    const userToFollow = await prisma.user.findUnique({
      where: { userName: username, deletedAt: null },
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
      where: { userName: username, deletedAt: null },
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

export const getUserSuggestions = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const currentUser = req.user as User;
    let suggestionsIDs = new Set();
    let tempUser = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
        deletedAt: null,
      },
      include: {
        follower: true,
      },
    });

    let followedIDs = tempUser?.follower;
    let followedSetIDs = new Set();
    let suggestions = [];
    for (let i = 0; followedIDs && i < followedIDs?.length; i++)
      followedSetIDs.add(followedIDs[i]?.followedId);
    let i = 0;
    while (
      followedIDs &&
      followedIDs.length > 0 &&
      i < 20 &&
      suggestions.length < 50
    ) {
      i++;
      let randomIndex = Math.floor(Math.random() * followedIDs.length);
      let followersArray = await prisma.follow.findMany({
        take: 10,
        where: {
          folowererId: followedIDs[randomIndex].followedId,
          follower: {
            deletedAt: null,
          },
        },
      });
      for (
        let j = 0;
        j < followersArray.length && suggestions.length < 50;
        j++
      ) {
        if (
          !followedSetIDs.has(followersArray[j].followedId) &&
          !suggestionsIDs.has(followersArray[j].followedId) &&
          followersArray[j].followedId != currentUser.id
        ) {
          suggestionsIDs.add(followersArray[j].followedId);
          suggestions.push(
            await prisma.user.findUnique({
              where: {
                id: followersArray[j].followedId,
                deletedAt: null,
              },
              select: {
                name: true,
                birthDate: true,
                location: true,
                url: true,
                description: true,
                verified: true,
                followersCount: true,
                followingCount: true,
                createdAt: true,
                profileBannerUrl: true,
                profileImageUrl: true,
                email: true,
                userName: true,
              },
            }),
          );
        }
      }
      followedIDs.splice(randomIndex, 1);
    }
    if (suggestions.length < 50) {
      let popUsers = await prisma.user.findMany({
        take: 5100,
        where: {
          deletedAt: null,
        },
        orderBy: {
          followersCount: 'desc',
        },
        select: {
          id: true,
        },
      });
      for (let i = 0; i < popUsers.length && suggestions.length < 50; i++) {
        if (
          !followedSetIDs.has(popUsers[i].id) &&
          !suggestionsIDs.has(popUsers[i].id) &&
          popUsers[i].id != currentUser.id
        ) {
          suggestionsIDs.add(popUsers[i]);
          const isFollowing = await isUserFollowing(
            (req.user as User).id,
            popUsers[i].id,
          );

          suggestions.push({
            ...(await prisma.user.findFirst({
              where: {
                id: popUsers[i].id,
                deletedAt: null,
              },
              select: {
                name: true,
                birthDate: true,
                location: true,
                url: true,
                description: true,
                verified: true,
                followersCount: true,
                followingCount: true,
                createdAt: true,
                profileBannerUrl: true,
                profileImageUrl: true,
                email: true,
                userName: true,
              },
            })),
            isFollowing,
          });
        }
      }
    }
    return res.json(suggestions.slice(0, 50)).status(200);
  },
);
