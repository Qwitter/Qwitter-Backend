import { Request, Response, NextFunction } from 'express';
import prisma from '../client';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { emailType } from '../types/email-types';
import { hash } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { User } from '.prisma/client';
import moment from 'moment-timezone';
import { getNumOfTweets } from '../repositories/userRepository';
import { sendNotification } from '../utils/notifications';

/**
 * check on the credientials of the user for login
 * if valid sends notification for a log in and return sends the token and user details with status code 200
 * else return 400 status code (wrong password or email) if not valid
 */
export const login = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email_or_username, password } = req.body;
    const hashedPassword = await hash(password, process.env.SALT as string);
    let user = null;

    if (email_or_username.includes('@')) {
      const userEmail = await prisma.user
        .findUnique({
          where: {
            email: email_or_username.toLowerCase(),
            password: hashedPassword,
            deletedAt: null,
          },
        })
        .catch();
      user = userEmail;
    } else {
      const userUsername = await prisma.user
        .findUnique({
          where: {
            userName: email_or_username.toLowerCase(),
            password: hashedPassword,
            deletedAt: null,
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
    //TODO: add login notification
    const notification = await prisma.notification.create({
      data: {
        createdAt: new Date(),
        senderId: user.id,
        type: 'login',
      },
    });
    await prisma.recieveNotification.create({
      data: {
        notificationId: notification.id,
        recieverId: user.id,
      },
    });
    const notificationObject = {
      type: 'login',
      createdAt: new Date(),
    };
    sendNotification(user, notificationObject);
    sendToken(
      token,
      200,
      {
        token: token,
        user: { ...user, tweetCount: getNumOfTweets(user.userName) },
      },
      res,
    );
  },
);

/**
 * sends a reset email to user when forgeting the password
 * if user is not found returns status code 404 (User not found)
 * else password reset email is sent and returns status code 200
 */
export const forgotPassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // 1) Check that user exists
    const user = await prisma.user.findUnique({
      where: { email: req.body.email.toLowerCase(), deletedAt: null },
    });
    if (!user) {
      return _next(new AppError('User not found', 404));
    }
    // 2) Generate the random token
    // const passwordResetExpireTime = 30; // 30 minutes
    const currentDateTime = moment();
    const expiryDate = currentDateTime.add(1, 'days');
    const resetToken = crypto.randomBytes(4).toString('hex');
    const resetTokenHashed = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    await prisma.user.update({
      where: {
        email: user.email.toLowerCase(),
      },
      data: {
        passwordResetToken: resetTokenHashed,
        passwordResetExpires: expiryDate.format(),
      },
    });

    // 3) Send it to user email

    // TODO: The subject should have the link to the frontend page where the user will send the password and
    // the password confirm to send a patch request to the server
    const resetEmail: emailType = {
      to: user.email.toLowerCase(),
      subject: 'Password Reset',
      text: 'Reset Password ' + resetToken,
    };
    await sendEmail(resetEmail);
    return _res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  },
);

/**
 * reset password using a token
 * if token is invalid return status code 400 (Invalid Token)
 * if token is expired return status code 400 (Token expired. Request another token)
 * else changes the password and return the token with status code 200
 */
export const resetPassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // 1) Check that user exists
    const resetTokenHashed = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: resetTokenHashed, deletedAt: null },
    });
    if (!user) {
      return _next(new AppError('Invalid Token', 400));
    }
    if (
      user.passwordResetExpires &&
      user.passwordResetExpires < new Date(Date.now())
    ) {
      return _next(new AppError('Token expired. Request another token.', 400));
    }
    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    await prisma.user.update({
      where: {
        email: user.email.toLowerCase(),
      },
      data: {
        passwordResetExpires: undefined,
        passwordResetToken: undefined,
      },
    });

    sendToken(
      token,
      200,
      {
        token: token,
        message: 'Password reset was successful',
      },
      _res,
    );
  },
);

/**
 * changes password
 * if password == passwordConfirmation returns status code 200 and update the password
 * if password != passwordConfirmation returns status code 400 (The passwords do not match)
 */
export const changePassword = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    // Check that the passwords match
    if (req.body.password !== req.body.passwordConfirmation) {
      return _next(new AppError('The passwords do not match', 400));
    }
    const user = req.user as User;
    // Update the user with the new password
    const hashedPassword = await hashPassword(req.body.password);
    await prisma.user.update({
      where: {
        id: user.id,
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

/**
 * update password
 * if old password is incorrect return status code 401 (Incorrect old password)
 * else change password and send status code 200 (Password changed successfully)
 */
export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;

    const user = req.user as User;
    const hashedOldPassword = await hashPassword(oldPassword);
    const isPasswordCorrect = hashedOldPassword === user.password;

    if (!isPasswordCorrect) {
      return next(new AppError('Incorrect old password', 401));
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(Date.now()),
      },
    });

    res.status(200).json({
      message: 'Password changed successfully',
    });
  },
);

const hashPassword = async (password: string) => {
  return await hash(password, process.env.SALT as string);
};

/**
 * creates account
 * if user already exists return status code 409 (User already exists)
 * if email not verified return status code 403 (Email is not Verified)
 * else create account and send token and user details with status code 200
 */
export const signUp = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email.toLowerCase(),
        deletedAt: null,
      },
    });
    if (user) {
      _res.status(409).json({ message: 'User already exists' });
      // return _next(new AppError('User already exists', 409));
    } else {
      const verify = await prisma.emailVerification.findFirst({
        where: {
          email: req.body.email.toLowerCase(),
        },
      });
      if (!verify) {
        _res.status(403).json({ message: 'Email is not Verified' });
        // return _next(new AppError('Email is not Verified', 403));
      } else if (!verify.verified) {
        await prisma.emailVerification.delete({
          where: {
            email: req.body.email.toLowerCase(),
          },
        });
        _res.status(403).json({ message: 'Email is not Verified' });
      } else {
        const hashedPassword = await hashPassword(req.body.password);
        const uniqueUserName = await createUniqueUserName(req.body.name, 6);
        const newUser = await prisma.user.create({
          data: {
            name: req.body.name,
            birthDate: req.body.birthDate,
            createdAt: new Date().toISOString(),
            email: req.body.email.toLowerCase(),
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
            unSeenConversation: true,
          },
        });
        const { id, ...newObject } = newUser;
        const token = sign({ id: id }, process.env.JWT_SECRET as string, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        sendToken(
          token,
          200,
          {
            token,
            data: {
              ...newObject,
              tweetCount: getNumOfTweets(newObject.userName),
            },
            suggestions: uniqueUserName.slice(1, 6),
          },
          _res,
        );
      }
    }
  },
);

/**
 * creates account
 * if missing token return status code 401 (Unauthorized access)
 * if user already exists return status code 409 (User already exists)
 * if missing credentails return status code 403 (Invalid access credentials)
 * else create account and send token and user details with status code 200
 */
export const signUpGoogle = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const auth_header: string = req.headers.authorization as string;

    if (!auth_header || !auth_header.startsWith('Bearer')) {
      return _next(new AppError('Unauthorized access', 401));
    }

    const token: string = auth_header.split(' ')[1];
    const payloadData = await verify(token, process.env.JWT_SECRET as string);
    const google_id = (payloadData as JwtPayload).google_id;
    const email = (payloadData as JwtPayload).email?.toLowerCase();
    const name = (payloadData as JwtPayload).name;
    if (!google_id || !email || !name) {
      return _next(new AppError('Invalid access credentials', 409));
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });
    if (user) {
      _res.status(409).json({ message: 'User already exists' });
    } else {
      const uniqueUserName = await createUniqueUserName(name, 1);
      const newUser = await prisma.user.create({
        data: {
          name: name,
          birthDate: req.body.birthDate,
          createdAt: new Date().toISOString(),
          email: email.toLowerCase(),
          userName: uniqueUserName[0],
          password: '',
          google_id: google_id,
        },
        select: {
          notificationCount: true,
          unSeenConversation: true,
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
        user: { ...newObject, tweetCount: getNumOfTweets(newObject.userName) },
      });
    }
  },
);

/**
 * log in the user using google
 * sends notification for a log in
 * and
 * sends the token and user details with status code 200
 */
export const logInGoogle = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const user = req.user as User;
    const token = signJWT(user.id);
    //TODO: add login notification
    const notification = await prisma.notification.create({
      data: {
        createdAt: new Date(),
        senderId: user.id,
        type: 'login',
      },
    });
    await prisma.recieveNotification.create({
      data: {
        notificationId: notification.id,
        recieverId: user.id,
      },
    });
    const notificationObject = {
      type: 'login',
      createdAt: new Date(),
    };
    sendNotification(user, notificationObject);
    _res.status(200).json({
      token,
      user: { ...user, tweetCount: getNumOfTweets(user.userName) },
    });
  },
);

/**
 * takes userName or password and checks its availability
 * if not available returns status code 404
 * if available returns status code 200
 */
export const checkExistence = catchAsync(
  async (req: Request, _res: Response, _next: NextFunction) => {
    const qualifier: string = req.body.userNameOrEmail.toLowerCase();
    if (isEmail(qualifier)) {
      const user = await prisma.user.findFirst({
        where: {
          email: qualifier,
          deletedAt: null,
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
          deletedAt: null,
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
  },
);

/**
 * check if the string is a valid email format
 */
export const isEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    ? true
    : false;
};

/**
 * send verification email to the user email to check authentication
 * and return with status codde 200(Sent Verification Email Successfully )
 */
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
        email: req.body.email.toLowerCase(),
      },
    });
    if (existingVerificationCode) {
      await prisma.emailVerification.update({
        where: {
          email: req.body.email.toLowerCase(),
        },
        data: {
          code: verificationTokenHashed,
          verified: false,
        },
      });
    } else {
      await prisma.emailVerification.create({
        data: {
          email: req.body.email.toLowerCase(),
          code: verificationTokenHashed,
        },
      });
    }
    // Send it to user email
    const verificationEmail: emailType = {
      to: req.body.email.toLowerCase(),
      subject: 'Email Verification',
      text: 'Email Verification: ' + verificationToken,
    };

    await sendEmail(verificationEmail);
    res.status(200).send({
      message: 'Sent Verification Email Successfully ',
    });
  },
);

/**
 * verify email using the token
 * if user already exists return status code 409 (User already exists)
 * if no validation code is sent return status code 409 (Please request Verification first)
 * if wrong token return status code 409 (Wrong Token. Please check again)
 * else verify email and return status code 200
 */
export const verifyEmail = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email.toLowerCase(),
        deletedAt: null,
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
            email: req.body.email.toLowerCase(),
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
            email: req.body.email.toLowerCase(),
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
  },
);

/**
 * generates [countOfUniqueUserNames] usernames using the string [name] given
 * returns array of strings with the unique usernames
 */
export async function createUniqueUserName(
  name: string,
  countOfUniqueUserNames: number,
) {
  const suggestions: string[] = [];
  while (countOfUniqueUserNames) {
    let userName = name.replace(/\s+/g, '').toLowerCase();
    const max_len = 15;
    const added_bytes = 3;
    if (userName.length > max_len - added_bytes * 2)
      userName = userName.substring(0, max_len - added_bytes * 2);
    userName += crypto.randomBytes(added_bytes).toString('hex');
    if (suggestions.find((element) => element === userName)) {
      continue;
    }
    const user = await prisma.user.findFirst({
      where: {
        userName: userName,
        deletedAt: null,
      },
    });
    if (!user) {
      countOfUniqueUserNames--;
      suggestions.push(userName);
    }
  }
  return suggestions;
}

/**
 * returns a token for a certain userId
 */
export const generateJWTToken = (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * generates unique usernames
 * returns response of array of strings with the unique usernames with status code 200
 */
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
  },
);

/**
 * checks if password is valid
 * returns status code 200 with response of validity
 */
export const checkPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { password } = req.body;

    const user = req.user as User;
    const hashedOldPassword = await hashPassword(password);
    const isPasswordCorrect = hashedOldPassword === user.password;

    res.status(200).json({
      correct: isPasswordCorrect,
    });
  },
);

/**
 * check if the email is available
 * if used returns status code 404 (email is already used)
 * if not verified returns status code 404 (email not verified)
 * else it updates the email and returns user data with status code 200
 */
export const changeEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const tempUser = await prisma.user.findFirst({
      where: {
        email: req.body.email.toLowerCase(),
        deletedAt: null,
      },
    });
    if (tempUser) {
      return next(new AppError('email is already used', 404));
    }
    const verified = await prisma.emailVerification.findFirst({
      where: { email: req.body.email.toLowerCase() },
    });
    if (!verified) {
      return next(new AppError('email not verified', 404));
    } else {
      await prisma.emailVerification.delete({
        where: {
          email: user.email.toLowerCase(),
        },
      });
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: req.body.email.toLowerCase(),
        },
      });

      res
        .json({
          notificationCount: user.notificationCount,
          unSeenConversation: user.unSeenConversation,
          userName: updatedUser.userName,
          name: updatedUser.name,
          birthDate: updatedUser.birthDate,
          url: updatedUser.url,
          description: updatedUser.description,
          protected: updatedUser.protected,
          verified: updatedUser.verified,
          followersCount: updatedUser.followersCount,
          followingCount: updatedUser.followingCount,
          createdAt: updatedUser.createdAt,
          profileBannerUrl: updatedUser.profileBannerUrl,
          profileImageUrl: updatedUser.profileImageUrl,
          email: updatedUser.email,
          tweetCount: getNumOfTweets(updatedUser.userName),
        })
        .status(200);
    }
  },
);

/**
 * generate token from the userId
 */
export const signJWT = (id: string) => {
  return sign({ id: id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * send token to the user
 */
const sendToken = (
  token: string,
  statusCode: number,
  responseBody: any,
  res: Response,
) => {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const days = Number(expiresIn?.substring(0, expiresIn.length - 1)); // To remove the d in the end
  res.cookie('qwitter_jwt', 'Bearer ' + token, {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, // Will be true when we deploy https
  });
  res.status(statusCode).json(responseBody);
};
