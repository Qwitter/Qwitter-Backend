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
  return res.status(err.statusCode).json({
    status: err.status,
    message: `${err.message} `,
  });
};

export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error: any = { ...err };
    error.message = err.message;
    sendErrorProd(error, req, res);
  }
}
