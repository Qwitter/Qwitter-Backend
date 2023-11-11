import { Request, Response, NextFunction } from 'express';

const sendErrorDev = async (err: any, _req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = async (err: any, _req: Request, res: Response) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  return res.status(statusCode).json({
    status: err.status,
    message: message,
  });
};

export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    sendErrorDev(err, req, res);
  } else {
    sendErrorProd(err, req, res);
  }
}
