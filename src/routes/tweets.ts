/**
 * @openapi
 * '/api/tweets/toggle-like':
 *  post:
 *     tags:
 *     - Tweets
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
 */
