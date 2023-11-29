import express from 'express';
import { CreateTweetSchema } from '../schemas/tweetSchema';
import { validate } from '../utils/validator';
import {
  deleteTweet,
  getTweetLikers,
  getUserTweets,
  postTweet,
  searchHastags,
  searchTweets,
  getUserLikedTweets,
  getUserMediaTweets,
  getTweetReplies,
  getTweetRetweets,
  likeTweet,
  unlikeTweet,
  getUserReplies,
} from '../controllers/tweetController';
import { isLoggedIn } from '../middlewares/authMiddlewares';
import {
  getTweetLikesSchema,
  getTweetRepliesSchema,
  getTweetTimeline,
  getProfileTab,
  likeUnlikeTweetSchema,
} from '../schemas/tweetLikeSchema';
import { getTweet } from '../controllers/tweetController';
import { uploadTweetMediaMiddleware } from '../middlewares/uploadMiddleware';
import { tweetExists } from '../middlewares/tweetExists';
const router = express.Router();

/**
 * @openapi
 * '/api/v1/tweets/hashtags':
 *  get:
 *     tags:
 *     - Tweet
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: q
 *         in: query
 *         description: Word to get hashtags similar to or indentical to that word
 *         schema:
 *           type: string
 *     summary: Returns suggestions for hashtags
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/hashtag'
 *
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.route('/hashtags').get(isLoggedIn, searchHastags);

/**
 * @openapi
 * '/api/v1/tweets/user/{username}':
 *  get:
 *     tags:
 *     - Tweet
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
 * '/api/v1/tweets/user/{username}/replies':
 *  get:
 *     tags:
 *     - Tweet
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: Get Replies Section in Profile
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
router.route('/user/:userName/replies').get(isLoggedIn, getUserReplies);

/**
 * @openapi
 * '/api/v1/tweets/{id}/like':
 *  post:
 *     tags: [Tweet]
 *     summary: Like a Tweet
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
router
  .route('/:id/like')
  .post(isLoggedIn, validate(likeUnlikeTweetSchema), likeTweet);
router
  .route('/:id/like')
  .delete(isLoggedIn, validate(likeUnlikeTweetSchema), unlikeTweet);

/**
 * @openapi
 * '/api/v1/tweets/user/{username}/like':
 *  get:
 *     tags:
 *     - Tweet
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *       - name: limit
 *         in: query
 *         schema:
 *           type: string
 *     summary: Get Tweets user like
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
router
  .route('/user/:username/like')
  .get(isLoggedIn, validate(getProfileTab), getUserLikedTweets);

/**
 * @openapi
 * '/api/v1/tweets/user/{username}/media':
 *  get:
 *     tags:
 *     - Tweet
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *       - name: limit
 *         in: query
 *         schema:
 *           type: string
 *     summary: Get media Tweets user posted
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

router
  .route('/user/:username/media')
  .get(isLoggedIn, validate(getProfileTab), getUserMediaTweets);

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
 * /api/v1/tweets/{id}/like:
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
 *     summary: get likers users of a tweet by Id
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
 * '/api/v1/tweets':
 *  get:
 *     tags:
 *     - Tweet
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: q
 *         in: query
 *         description: 'Word to search'
 *         schema:
 *           type: string
 *       - name: hashtag
 *         in: query
 *         description: If the hashtag is in the query, only the tweets including that hashtag will be returned
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *       - name: limit
 *         in: query
 *         schema:
 *           type: string
 *     summary: Get Timeline, Search for Tweets and search for tweets that include a hashtag
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
router.route('/').get(isLoggedIn, validate(getTweetTimeline), searchTweets);

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

export default router;
