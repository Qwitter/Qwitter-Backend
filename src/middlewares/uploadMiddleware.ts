import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/appError';
import { UserRequest } from 'request-types';

export const multerStorage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, 'public/imgs/users');
  },
  filename: function (
    req: UserRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}${Date.now()}.${ext}`);
  },
});

export const multerFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, valid: boolean) => void,
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an image file`, 400), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadImageMiddleware = upload.single('photo');
