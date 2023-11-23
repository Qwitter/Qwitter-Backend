import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '@prisma/client';
import prisma from '../client';
import { AppError } from '../utils/appError';

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
    const user = await prisma.user
    .findUnique({
      where: {
        userName:_req.params.username
      },
    })
    //const { id,google_id,password,passwordChangedAt,passwordResetToken,passwordResetExpires,deletedAt, ...resposeObject } = user;
    if(user){
    const resposeObject={
      userName:user.userName,
      name:user.name,
      birthDate:user.birthDate,
      url:user.url,
      description:user.description,
      protected:user.protected,
      verified:user.verified,
      followersCount:user.followersCount,
      followingCount:user.followingCount,
      createdAt:user.createdAt,
      profileBannerUrl:user.profileBannerUrl,
      profileImageUrl:user.profileImageUrl,
      email:user.email,
    }
    res.json(resposeObject).status(200)
  }
  else{
    return _next(new AppError('User not found', 404));
  }

  }

)


export const putUserProfile=catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const user=_req.user as User;
    const updatedUser= await prisma.user.update(
      {
        where:{
          userName: user.userName,
        },
        data:{
          name:_req.body.name,
          description:_req.body.description,
          location:_req.body.location,
          url:_req.body.url,
          birthDate:_req.body.birth_date
        }
      }
      )
    const { id,google_id,password,passwordChangedAt,passwordResetToken,passwordResetExpires,deletedAt, ...resposeObject } = updatedUser;
    res.status(200).json(resposeObject)
  }
)
