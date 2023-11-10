import { Request, Response, NextFunction } from 'express';
import prisma from '../client';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { emailType } from '../types/email-types';
import { hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { User } from '.prisma/client';

export const login = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email_or_username, password } = req.body;
    const hashedPassword = await hash(password, process.env.SALT as string);
    let user = null;

    if (email_or_username.includes('@')) {
      const userEmail = await prisma.user
        .findUnique({
          where: {
            email: email_or_username,
            password: hashedPassword,
          },
        })
        .catch();
      user = userEmail;
    } else {
      const userUsername = await prisma.user
        .findUnique({
          where: {
            userName: email_or_username,
            password: hashedPassword,
          },
        })
        .catch();
      user = userUsername;
    }

    if (!user) {
      res.status(400);
      res.send({ message: 'wrong password or email' });
      return;
    }
    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token: token, user });
  },
);

export const forgotPassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // 1) Check that user exists
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
      subject: 'Email Verif',
      text: 'Reset Password ' + resetToken,
    };
    await sendEmail(resetEmail);
    return _res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  },
);

export const resetPassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // 1) Check that user exists
    const resetTokenHashed = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: resetTokenHashed },
    });
    if (!user) {
      return _next(new AppError('Invalid Token', 400));
    }
    if (
      user.passwordResetExpires &&
      user.passwordResetExpires > new Date(Date.now())
    ) {
      return _next(new AppError('Token expired. Request another token.', 400));
    }

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        passwordChangedAt: new Date(Date.now()),
        passwordResetExpires: undefined,
        passwordResetToken: undefined,
      },
    });

    _res.status(200).send({
      message: 'Password reset was successful',
    });
  },
);

export const changePassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // Check that the passwords match
    if (req.body.password !== req.body.passwordConfirmation) {
      return _next(new AppError('The passwords do not match', 400));
    }
    // Update the user with the new password
    const hashedPassword = await hashPassword(req.body.password);
    await prisma.user.update({
      where: {
        id: req.body.userId,
      },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(Date.now()),
      },
    });
    return _res.status(200).json({
      message: 'Password Changed Successfully',
    });
  },
);

const hashPassword = async (password: string) => {
  return await hash(password, process.env.SALT as string);
};

export const signUp = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      _res.status(409).json({ message: 'User already exists' });
      // return _next(new AppError('User already exists', 409));
    } else {
      const verify = await prisma.emailVerification.findFirst({
        where: {
          email: req.body.email,
        },
      });
      if (!verify) {
        _res.status(403).json({ message: 'Email is not Verified' });
        // return _next(new AppError('Email is not Verified', 403));
      } else if (!verify.verified) {
        await prisma.emailVerification.delete({
          where: {
            email: req.body.email,
          },
        });
        _res.status(403).json({ message: 'Email is not Verified' });
        // return _next(new AppError('Email is not Verified', 403));
      } else {
        const hashedPassword = await hashPassword(req.body.password);
        const uniqueUserName = await createUniqueUserName(req.body.name, 6);
        const newUser = await prisma.user.create({
          data: {
            name: req.body.name,
            birthDate: req.body.birthDate,
            createdAt: new Date().toISOString(),
            email: req.body.email,
            userName: uniqueUserName[0],
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
        const { id, ...newObject } = newUser;
        const token = sign({ id: id }, process.env.JWT_SECRET as string, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        _res.status(200).json({
          token,
          data: newObject,
          suggestions: uniqueUserName.slice(1, 6),
        });
      }
    }
  },
);

export const signUpGoogle = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    if(!req.body.google_id) {
      _res.status(404).json({ message: 'Google Auth ID not found' });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      _res.status(409).json({ message: 'User already exists' });
      // return _next(new AppError('User already exists', 409));
    } else {
      const uniqueUserName = [req.body.username] || await createUniqueUserName(req.body.name, 6);
      const newUser = await prisma.user.create({
        data: {
          name: req.body.name,
          birthDate: req.body.birthDate,
          createdAt: new Date().toISOString(),
          email: req.body.email,
          userName: uniqueUserName[0],
          password: "",
          google_id: req.body.google_id
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
      const { id, ...newObject } = newUser;
      const token = sign({ id: id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      _res.status(200).json({
        token,
        data: newObject,
      });
    }
  },
);


export const checkExistence = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const qualifier: string = req.body.userNameOrEmail;
    if (isEmail(qualifier)) {
      const user = await prisma.user.findFirst({
        where: {
          email: qualifier,
        },
      });
      if (user) {
        _res.status(404).json({
          available: false,
        });
      } else {
        _res.status(200).json({
          available: true,
        });
      }
    } else {
      const user = await prisma.user.findFirst({
        where: {
          userName: qualifier,
        },
      });
      if (user) {
        _res.status(404).json({
          available: false,
        });
      } else {
        _res.status(200).json({
          available: true,
        });
      }
    }
    _next();
  },
);

export const isEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    ? true
    : false;
};

export const sendVerificationEmail = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Generate the random token

    // the 0 in readUInt32LE is the offset or index from which you want to read a 32-bit unsigned integer (LE stands for Little Endian).
    const verificationToken = crypto
      .randomBytes(4)
      .readUInt32LE(0)
      .toString()
      .substring(0, 6);
    const verificationTokenHashed = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const existingVerificationCode = await prisma.emailVerification.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (existingVerificationCode) {
      await prisma.emailVerification.update({
        where: {
          email: req.body.email,
        },
        data: {
          code: verificationTokenHashed,
          verified: false,
        },
      });
    } else {
      await prisma.emailVerification.create({
        data: { email: req.body.email, code: verificationTokenHashed },
      });
    }
    // Send it to user email
    const verificationEmail: emailType = {
      to: req.body.email,
      subject: 'Email Verification',
      text: 'Email Verification: ' + verificationToken,
    };

    sendEmail(verificationEmail);
    res.status(200).send({
      message: 'Sent Verification Email Successfully ',
    });
  },
);

export const logout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'You are not logged in' });
    } else {
      verify(token, process.env.JWT_SECRET as string, (err) => {
        if (err) {
          res.status(401).json({ message: 'Invalid token' });
        } else {
          res.status(200).json({ message: 'Successfully logged out' });
        }
      });
    }
  },
);

export const verifyEmail = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      res.status(409).json({ message: 'User already exists' });
      // _next(new AppError('User already exists', 409));
    } else {
      // Get the hashed token
      const verificationToken = req.params.token;
      const verificationTokenHashed = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

      const existingVerificationCode = await prisma.emailVerification.findFirst(
        {
          where: {
            email: req.body.email,
          },
        },
      );
      if (!existingVerificationCode) {
        res.status(409).json({ message: 'Please request Verification first' });
        // _next(new AppError('Please request Verification first', 409));
      } else if (
        existingVerificationCode &&
        existingVerificationCode.code !== verificationTokenHashed
      ) {
        res.status(409).json({ message: 'Wrong Token. Please check again' });
        // _next(new AppError('Wrong Token. Please check again', 409));
      } else {
        await prisma.emailVerification.update({
          where: {
            email: req.body.email,
          },
          data: {
            verified: true,
          },
        });

        res.status(200).send({
          message: 'Email Verified Successfully',
        });
      }
    }
    _next();
  },
);

export async function createUniqueUserName(
  name: string,
  countOfUniqueUserNames: number,
) {
  const suggestions: string[] = [];
  while (countOfUniqueUserNames) {
    let userName = name.replace(/\s+/g, '').toLowerCase();
    userName += crypto.randomBytes(3).toString('hex');
    if (suggestions.find((element) => element === userName)) {
      continue;
    }
    const user = await prisma.user.findFirst({
      where: {
        userName: userName,
      },
    });
    if (!user) {
      countOfUniqueUserNames--;
      suggestions.push(userName);
    }
  }
  return suggestions;
}

export const generateJWTToken = (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const userNameSuggestions = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const user = req.user;
    const uniqueUserName = await createUniqueUserName(
      req.body.userName ? req.body.userName : (user as User).name,
      5,
    );
    _res.status(200).json({
      suggestions: uniqueUserName,
    });
    _next();
  },
);
