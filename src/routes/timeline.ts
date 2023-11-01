/**
 * @openapi
* '/api/timeline':
*  get:
*     tags:
*     - Timeline
*     parameters:
*       - name: auth_key
*         in: header
*         description: ''
*         required: true
*         schema:
*           type: string
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
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
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
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
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
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
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
 *     parameters:
 *       - name: auth_key
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: word
 *         in: header
 *         description: 'Word to search'
 *         required: true
 *         schema:
 *           type: string

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
