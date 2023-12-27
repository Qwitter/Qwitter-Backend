import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/appError';
import { UserRequest } from 'request-types';
import { BlobServiceClient } from '@azure/storage-blob';

/***
 * Multer Storage Configuration
 */
export const multerStorage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, `public/imgs/user${_req.url}`);
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

/***
 * Middleware for storing any media while posting tweet
 * @_req Request sent from user
 * @_file Media to be uploaded
 */
export const tweetMediaStorage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, `public/imgs/tweet`);
  },
  filename: function (
    req: UserRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `tweet-${req.user.id}${Date.now()}.${ext}`);
  },
});

/***
 * Middleware for storing any media while sending message
 * @_req Request sent from user
 * @_file Media to be uploaded
 */
export const messageMediaStorage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, `public/imgs/message`);
  },
  filename: function (
    req: UserRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `message-${req.user.id}${Date.now()}.${ext}`);
  },
});

/***
 * Middleware used for filtering non-image files
 */
export const imageFilter = (
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
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/mpeg',
]; // Add more mime types if needed

/***
 * Middleware used for filtering files based on mime type
 */
const mediaFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, valid: boolean) => void,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Only JPEG, PNG, GIF, MP4, and MPEG files are allowed.'`,
        400,
      ),
      false,
    );
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: imageFilter,
});
export const uploadMedia = multer({
  storage: tweetMediaStorage,
  fileFilter: mediaFilter,
});

export const messageMedia = multer({
  storage: messageMediaStorage,
  fileFilter: mediaFilter,
});

/**
 * Middleware used for uploading profile/banner image (single image)
 */
export const uploadImageMiddleware = upload.single('photo');

/**
 * Middleware used for uploading tweet media (up to 5 images max)
 */
export const uploadTweetMediaMiddleware = uploadMedia.array('media[]', 5);

/**
 * Middleware uesd for uploading message media (single file)
 */
export const uploadMediaMessageMiddleware = messageMedia.single('media');

// Set your connection string and container name

// Function to upload an image to Azure Blob Storage
const connectionString = process.env.AZURE_BUCKET_URL as string;
const containerName = process.env.AZURE_CONTAINER as string;

/***
 * function to upload files to azure blog storage
 * @param localFilePath path of the file to upload
 * @param blobName file name
 * @return returns the url of the blob after uploading
 */
export async function uploadImage(localFilePath: string, blobName: string) {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadFile(localFilePath + blobName);
    const options = { blobHTTPHeaders: { blobContentType: 'image' } };
    await blockBlobClient.setHTTPHeaders(options.blobHTTPHeaders);
    return blockBlobClient.url;
    // const trimmedString = imageUrl.substring(imageUrl.indexOf('/')); // Trims the server path
    // await fs.unlink('./public/' + trimmedString, (err) => {
    //   if (err) {
    //     console.log(error);
    //   }
    // });
  } catch (error) {
    console.error(`Error uploading file "${blobName}":`, error.message);
    return '';
  }
}

/***
 * Delete image from azure blob storage
 * @param blobName url of blob to be deleted
 */
export async function deleteImage(blobName: string) {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(
    getLastPartOfUrl(blobName),
  );

  try {
    await blockBlobClient.delete();
    console.log(`Blob "${blobName}" deleted successfully.`);
  } catch (error) {
    console.error('Error deleting blob:', error.message);
  }
}

/***
 * Helper function to return blob name from url
 * @param urlString 
 */
function getLastPartOfUrl(urlString: string) {
  const url = new URL(urlString);
  const path = url.pathname;
  const sanitizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  const pathSegments = sanitizedPath.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  return lastSegment;
}
