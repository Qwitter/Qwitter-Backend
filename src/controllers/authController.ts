import { Request, Response, NextFunction } from 'express';

export const forgotPassword = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.send(200);
};
export const resetPassword = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.send(200);
};
