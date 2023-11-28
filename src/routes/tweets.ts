import express from 'express';
import { CreateTweetSchema } from '../schemas/tweetSchema';
import { validate } from '../utils/validator';
import {
  deleteTweet,
  getTweetLikers,
  getUserTweets,
  postTweet,
} from '../controllers/tweetController';
import { isLoggedIn } from '../middlewares/authMiddlewares';
import {
  getTweetReplies,
  getTweetRetweets,
} from '../controllers/tweetController';
import {
  getTweetLikesSchema,
  getTweetRepliesSchema,
} from '../schemas/tweetLikeSchema';
import { getTweet } from '../controllers/tweetController';
import { uploadTweetMediaMiddleware } from '../middlewares/uploadMiddleware';
import { tweetExists } from '../middlewares/tweetExists';
const router = express.Router();
/**
 * @openapi
 * /api/v1/tweets:
 *  post:
 *     tags: [Tweet]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: add tweet
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateTweetPayload'
 *     responses:
 *      200:
 *        description: Tweet was added successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/addTweetresponse200'
 *      403:
 *        description: Unauthorized
 */

router
  .route('/')
  .post(
    isLoggedIn,
    uploadTweetMediaMiddleware,
    validate(CreateTweetSchema),
    postTweet,
  );

/**
 * @openapi
 * /api/v1/tweets/{id}:
 *  delete:
 *     tags: [Tweet]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: Tweet id to delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     summary: Delete tweet by Id
 *     responses:
 *      204:
 *        description: Tweet was deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/deleteTweetResponse204'
 *      404:
 *        description: Tweet was Not Found
 *      410:
 *        description: Tweet was Gone
 *      403:
 *        description: Unauthorized
 */
router.delete('/:id', tweetExists, deleteTweet);

/**
 * @openapi
 * /api/v1/tweets/{id}:
 *  get:
 *     tags: [Tweet]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: Tweet id to get
 *         required: true
 *         schema:
 *           type: string
 *     summary: Get tweet by Id
 *     responses:
 *      200:
 *        description: Tweet was found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getTweetResponse200'
 *      404:
 *        description: Tweet was Not Found
 *      410:
 *        description: Tweet was Gone
 *      403:
 *        description: Unauthorized
 */

router.get('/:id', getTweet);

/**
 * @openapi
 * /api/v1/tweets/{id}/replies:
 *  get:
 *     tags: [Tweet]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: Tweet id to get replies of
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     summary: get replies of a tweet by Id
 *     responses:
 *      200:
 *        description: Tweet was found and got replies successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getRepliesOfTweetResponse200'
 *      404:
 *        description: Tweet was Not Found
 *      403:
 *        description: Unauthorized
 */
router
  .route('/:id/replies')
  .get(isLoggedIn, validate(getTweetRepliesSchema), getTweetReplies);

/**
 * @openapi
 * /api/v1/tweets/{id}/likes:
 *  get:
 *     tags: [Tweet]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: Tweet id to get likers of
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     summary: get likers usernames of a tweet by Id
 *     responses:
 *      200:
 *        description: Tweet was found and got likers usernames successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getLikersOfTweetResponse200'
 *      404:
 *        description: Tweet was Not Found
 *      403:
 *        description: Unauthorized
 */
router
  .route('/:id/like')
  .get(isLoggedIn, validate(getTweetLikesSchema), getTweetLikers);

/**
 * @openapi
 * /api/v1/tweets/{id}/retweets:
 *  get:
 *     tags: [Tweet]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: Tweet id to get retweeters of
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     summary: get retweeters usernames of a tweet by Id
 *     responses:
 *      200:
 *        description: Tweet was found and got retweeters usernames successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getRetweetersOfTweetResponse200'
 *      404:
 *        description: Tweet was Not Found
 *      403:
 *        description: Unauthorized
 */
router
  .route('/:id/retweets')
  .get(isLoggedIn, validate(getTweetRepliesSchema), getTweetRetweets);

/**
 * @openapi
 * '/api/v1/tweets/user/{username}':
 *  get:
 *     tags:
 *     - Tweets
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: Get Tweets that the user created only
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReturnListOfTweets'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.route('/user/:userName/').get(isLoggedIn, getUserTweets);

/**
 * @openapi
 * '/api/v1/tweets/{id}/like':
 *  post:
 *     tags: [Tweet]
 *     summary: Like a Tweet
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/TweetToggleLikeInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TweetToggleLikeResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *  delete:
 *     tags: [Tweet]
 *     summary: Unlike a tweet
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/TweetToggleLikeInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TweetToggleLikeResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

router.route('/:id/like').post().delete();

export default router;
