import express from 'express';
import * as tweetController from '../controllers/tweetController';
import { isLoggedIn } from '../middlewares/authMiddlewares';

const router = express.Router();

/**
 * @openapi
* '/api/v1/timeline':
*  get:
*     tags:
*     - Timeline
*     parameters:
*       - name: authorization
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

 
 

 * '/api/v1/tweets/user/{username}/like':
 *  get:
 *     tags:
 *     - Timeline
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
 *     - Timeline
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
 *     - Timeline
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

 * '/api/v1/tweets/lookup':
 *  get:
 *    tags:
 *      - Timeline
 *    parameters:
 *      - name: authorization
 *        in: header
 *        description: 'Authorization token'
 *        required: true
 *        schema:
 *          type: string
 *      - name: word
 *        in: query
 *        required: true
 *        description: 'Word to search'
 *        schema:
 *          type: string
 *    summary: Search Tweets
 *    responses:
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
