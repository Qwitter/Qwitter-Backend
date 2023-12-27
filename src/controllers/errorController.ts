import { Request, Response, NextFunction } from 'express';

/**
 * send error while running server as development
 * @param err error happened
 * @param _req request sent from user
 * @param res response to be returned
 */
const sendErrorDev = async (err: any, _req: Request, res: Response) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  try {
    return res.status(statusCode).json({
      status: err.status,
      error: err,
      message: message,
      stack: err.stack,
    });
  } catch (err) {
    console.log(err);
  }
  return;
};

/**
 * send error while running server as production
 * @param err error happened
 * @param _req request sent from user
 * @param res response to be returned
 */
const sendErrorProd = async (err: any, _req: Request, res: Response) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  return res.status(statusCode).json({
    status: err.status,
    message: message,
  });
};


/**
 * global error handler that chooses between development & production
 */
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
