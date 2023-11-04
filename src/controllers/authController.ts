import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { emailType } from '../types/email-types';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const forgotPassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // 1) Check that user exists
    await prisma.user.create(req.body);
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      return _next(new AppError('User not found', 404));
    }
    // 2) Generate the random token
    const passwordResetExpireTime = 10 * 60 * 1000; // 10 minutes
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHashed = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const updatedUser = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        passwordResetToken: resetTokenHashed,
        passwordResetExpires: new Date(Date.now() + passwordResetExpireTime),
      },
    });
    console.log(updatedUser);
    // 3) Send it to user email

    // TODO: The subject should have the link to the frontend page where the user will send the password and
    // the password confirm to send a patch request to the server
    const resetEmail: emailType = {
      to: user.email,
      subject: 'Password Reset',
      text: 'Reset Password',
    };
    await sendEmail(resetEmail);
  },
);

export const signUp = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return _next(new AppError('User already exists', 409));
    }
    const verify = await prisma.emailVerification.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!verify) {
      return _next(new AppError('Email is not Verified ', 403));
    } else if (!verify.verified) {
      await prisma.emailVerification.delete({
        where: {
          email: req.body.email,
        },
      });
      return _next(new AppError('Email is not Verified ', 403));
    }
    const hashedPassword = await hash(req.body.password, 12);
    const uniqueUserName = await createUniqueUserName(req.body.name);
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        birthDate: req.body.birthDate,
        createdAt: new Date().toISOString(),
        email: req.body.email,
        userName: uniqueUserName,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        birthDate: true,
        location: true,
        url: true,
        description: true,
        protected: true,
        verified: true,
        followersCount: true,
        followingCount: true,
        createdAt: true,
        profileBannerUrl: true,
        profileImageUrl: true,
        userName: true,
      },
    });
    const userId = newUser.id;
    delete newUser.id;
    const token = sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    _res.status(200).json({ token, data: newUser });
  },
);

async function createUniqueUserName(name: string) {
  let userName = name.replace(/\s+/g, '').toLowerCase();
  userName += crypto.randomBytes(3).toString('hex');
  const user = await prisma.user.findFirst({
    where: {
      userName: userName,
    },
  });
  if (user) {
    return createUniqueUserName(name);
  }
  return userName;
}
