import express from 'express';
import { uploadImageMiddleware } from '../middlewares/uploadMiddleware';
import { isLoggedIn } from '../middlewares/authMiddlewares';
import { uploadProfilePicture } from '../controllers/userController';
const router = express.Router();

/**
 * @openapi
 * '/api/v1/user/followers':
 *  get:
 *     tags:
 *     - User
 *     summary: get list of user objects that follow the user
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string

 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/follow':
 *  get:
 *     tags:
 *     - User
 *     summary: get list of user objects that user follows
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/follow/{target_user_name}':
 *  post:
 *     tags:
 *     - User
 *     summary: follow a user
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: target_user_name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * /api/v1/user/follow/{target_user_name}:
 *  delete:
 *     tags: [User]
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: target_user_name
 *         in: path
 *         description: username of the target user
 *         required: true
 *         schema:
 *           type: string
 *     summary: unfollow a user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/block':
 *  get:
 *     tags:
 *     - User
 *     summary: get users blocked by the source user
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/block/{target_user_name}':
 *  post:
 *     tags:
 *     - User
 *     summary: block a user
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: target_user_name
 *         in: path
 *         description: username of the target user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * /api/v1/user/block/{target_user_name}:
 *  delete:
 *     tags: [User]
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: target_user_name
 *         in: path
 *         description: username of the target user
 *         required: true
 *         schema:
 *           type: string
 *     summary: unblock a user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/mute':
 *  get:
 *     tags:
 *     - User
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: get users muted by the source user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/mute/{target_user_name}':
 *  post:
 *     tags:
 *     - User
 *     summary: mute a user
 *     parameters:
 *       - name: target_user_name
 *         in: path
 *         description: username of the target user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * /api/v1/user/mute/{target_user_name}:
 *  delete:
 *     tags: [User]
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: target_user_name
 *         in: path
 *         description: usermane of the target user
 *         required: true
 *         schema:
 *           type: string
 *     summary: unmute a user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/user_lookup?q={name}':
 *  get:
 *     tags:
 *     - User Profile
 *     summary: get list of user objects that contain the prompted name
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: q
 *         in: query
 *         description: name or user name of the user
 *         required: true
 *         schema:
 *           type: string
 *
 *
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/profile_picture':
 *  post:
 *     tags:
 *     - User Profile
 *     summary: upload profile picture for the user
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *          multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/UploadImageInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UploadImageResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

router.post(
  '/profile_picture',
  isLoggedIn,
  uploadImageMiddleware,
  uploadProfilePicture,
);
/**
 * @openapi
 * '/api/v1/user/upload_profile_picture':
 *  delete:
 *     tags: [User Profile]
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: delete profile picture of a user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/upload_profile_banner':
 *  post:
 *     tags:
 *     - User Profile
 *     summary: upload profile banner for the user
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *          multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/UploadImageInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UploadImageResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/upload_profile_banner':
 *  delete:
 *     tags: [User Profile]
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: delete profile banner of a user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInteractionResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/profile':
 *  get:
 *     tags:
 *     - User Profile
 *     summary: get user profile
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/user_profile':
 *  put:
 *     tags:
 *     - User Profile
 *     summary: update user profile
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      content:
 *          object:
 *           schema:
 *              $ref: '#/components/schemas/UserProfile'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

router.route('/').get();

export default router;
