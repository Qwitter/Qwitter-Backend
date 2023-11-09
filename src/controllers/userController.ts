import { Request, Response, NextFunction } from 'express';
import prisma from '../client';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { emailType } from '../types/email-types';
import { hash } from 'bcrypt';

import { JwtPayload, sign, verify } from 'jsonwebtoken';

export const uploadProfilePicture = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(200).json({
      message: 'Image uploaded successfully',
    });
  },
);
