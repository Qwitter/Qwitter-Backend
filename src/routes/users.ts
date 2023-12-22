import express from 'express';
import { uploadImageMiddleware } from '../middlewares/uploadMiddleware';
import { authenticate, isLoggedIn } from '../middlewares/authMiddlewares';
import { validate } from '../utils/validator';
import {
  putUserProfileReqSchema,
  updateUserNameSchemaPayload,
  getUserSchema,
} from '../schemas/userSchema';
import * as userController from '../controllers/userController';

const router = express.Router();

/**
 * @openapi
 * '/api/v1/user/followers/{username}':
 *  get:
 *     tags:
 *     - User
 *     summary: get list of user objects that follow the user
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
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
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.get('/followers/:username', isLoggedIn, userController.getUserFollowers);
/**
 * @openapi
 * '/api/v1/user/follow/{username}':
 *  get:
 *     tags:
 *     - User
 *     summary: get list of user objects that user follows
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
 *         in: path
 *         description: username of the target user
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

router.get('/follow/:username', isLoggedIn, userController.getUserFollowings);

/**
 * @openapi
 * '/api/v1/user/follow/{username}':
 *  post:
 *     tags:
 *     - User
 *     summary: follow a user
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
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
router.post('/follow/:username', isLoggedIn, userController.followUser);

/**
 * @openapi
 * /api/v1/user/follow/{username}:
 *  delete:
 *     tags: [User]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
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
router.delete('/follow/:username', isLoggedIn, userController.unfollowUser);

/**
 * @openapi
 * '/api/v1/user/block':
 *  get:
 *     tags:
 *     - User
 *     summary: get users blocked by the source user
 *     parameters:
 *       - name: authorization
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

router.route('/block').get(isLoggedIn, userController.getBlockedUsers);

/**
 * @openapi
 * '/api/v1/user/block/{username}':
 *  post:
 *     tags:
 *     - User
 *     summary: block a user
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
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

router.route('/block/:username').post(isLoggedIn, userController.blockUser);

/**
 * @openapi
 * /api/v1/user/block/{username}:
 *  delete:
 *     tags: [User]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
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

router.route('/block/:username').delete(isLoggedIn, userController.unblockUser);

/**
 * @openapi
 * '/api/v1/user/mute':
 *  get:
 *     tags:
 *     - User
 *     parameters:
 *       - name: authorization
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
router.get('/mute/', isLoggedIn, userController.getUsersMutedByCurrentUser);

/**
 * @openapi
 * '/api/v1/user/mute/{username}':
 *  post:
 *     tags:
 *     - User
 *     summary: mute a user
 *     parameters:
 *       - name: username
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
router.post('/mute/:username', isLoggedIn, userController.muteUser);

/**
 * @openapi
 * /api/v1/user/mute/{username}:
 *  delete:
 *     tags: [User]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
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
router.delete('/mute/:username', isLoggedIn, userController.unmuteUser);

/**
 * @openapi
 * '/api/v1/user/':
 *  get:
 *     tags:
 *     - User
 *     summary: get user details of the requesting user using auth key
 *     parameters:
 *       - name: authorization
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
 *              $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * '/api/v1/user/':
 *  get:
 *     tags:
 *     - User Profile
 *     summary: get list of user objects that contain the prompted name
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: q
 *         in: param
 *         description: name or user name of the user
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
 *       - name: authorization
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
 * '/api/v1/user/suggestions':
 *  get:
 *     tags:
 *     - User
 *     summary: Get suggestions for users to follow
 *     parameters:
 *       - name: authorization
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

router.post(
  '/profile_picture',
  isLoggedIn,
  uploadImageMiddleware,
  userController.uploadProfilePicture,
);

/**
 * @openapi
 * '/api/v1/user/profile_picture':
 *  delete:
 *     tags: [User Profile]
 *     parameters:
 *       - name: authorization
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
router.delete(
  '/profile_picture',
  isLoggedIn,
  userController.deleteProfilePicture,
);

/**
 * @openapi
 * '/api/v1/user/profile_banner':
 *  post:
 *     tags:
 *     - User Profile
 *     summary: upload profile banner for the user
 *     parameters:
 *       - name: authorization
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
  '/profile_banner',
  isLoggedIn,
  uploadImageMiddleware,
  userController.uploadProfileBanner,
);
/**
 * @openapi
 * '/api/v1/user/profile_banner':
 *  delete:
 *     tags: [User Profile]
 *     parameters:
 *       - name: authorization
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
router.delete(
  '/profile_banner',
  isLoggedIn,
  userController.deleteProfileBanner,
);

/**
 * @openapi
 * '/api/v1/user/profile':
 *  put:
 *     tags:
 *     - User Profile
 *     summary: update user profile
 *     parameters:
 *       - name: authorization
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

router.put(
  '/profile',
  isLoggedIn,
  validate(putUserProfileReqSchema),
  userController.putUserProfile,
);

/**
 * @openapi
 * '/api/v1/user/username':
 *  patch:
 *     tags:
 *     - User Profile
 *     summary: update userName
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 default: zahran1234
 *     responses:
 *       "200":
 *        description: Success
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 */
router
  .route('/username')
  .patch(
    validate(updateUserNameSchemaPayload),
    isLoggedIn,
    userController.changeUserName,
  );

router.get('/', isLoggedIn, userController.getRequestingUser);
router.get(
  '/search',
  isLoggedIn,
  validate(getUserSchema),
  userController.getUsers,
);

router.route('/suggestions').get(isLoggedIn, userController.getUserSuggestions);
/**
 * @openapi
 * '/api/v1/user/{username}':
 *  get:
 *     tags:
 *     - User
 *     summary: get user details
 *     parameters:
 *       - name: authorization
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
 *              $ref: '#/components/schemas/User'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.get('/:username', authenticate, userController.getUser);
router.delete('/reset', userController.resetProfilePhotos);

export default router;
