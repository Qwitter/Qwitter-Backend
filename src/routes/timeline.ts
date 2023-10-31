/**
 * @openapi
* '/api/timeline':
*  get:
*     tags:
*     - Timeline
*     summary: Get Timeline 
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

 * '/api/tweets/user/{id}':
 *  get:
 *     tags:
 *     - Timeline
 *     summary: Get User Tweets
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

 * '/api/tweets/user-mentioned/{id}':
 *  get:
 *     tags:
 *     - Timeline
 *     summary: Get Tweets User Mentioned In
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

 * '/api/tweets/user-liked/{id}':
 *  get:
 *     tags:
 *     - Timeline
 *     summary: Get Tweets User Liked
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
 
 * '/api/tweets/search?q={word}':
 *  get:
 *     tags:
 *     - Timeline
 *     summary: Search Tweets
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
