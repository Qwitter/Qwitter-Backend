import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { userConversationExists } from '../repositories/conversationRepository';
import { User } from '@prisma/client';

/***
 * Middleware used to check if user is member in a given conversation given user & conversation ID
 */

export const userInConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user as User;
    const conversation = await userConversationExists(user.id, id);
    if (!conversation) {
      return res.status(401).json({ message: 'User is not in conversation' });
    }
    return next();
  },
);
