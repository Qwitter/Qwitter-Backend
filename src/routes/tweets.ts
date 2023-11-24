import express from 'express';
const router = express.Router();

/**
 * @openapi
 * /api/v1/tweets:
 *  post:
 *     tags: [Tweet]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     summary: add tweet
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateTweetPayload'
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
router.route('/').post();

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

router.route('/:id').delete().get();

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
router.route('/:id/replies').get();

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
router.route('/:id/likes').get();

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
router.route('/:id/retweets').get();

/**
 * @openapi
 * '/api/v1/tweets/toggle-like':
 *  post:
 *     tags: [Tweet]
 *     summary: Toggle Like a Tweet
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
