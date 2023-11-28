import express from 'express';

const router = express.Router();

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
 *     summary: Get Tweets that the user liked 
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
 * 
 * 
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
 *     summary: Not Determined YETTT !!!!!!!!!!
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
 *     summary: Get Tweets of user that include media  
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

export default router;
