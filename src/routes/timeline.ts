import express from 'express';
import { getForYouTimeline } from '../../src/controllers/tweetController';
import { isLoggedIn } from '../../src/middlewares/authMiddlewares';

const router = express.Router();

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
 */

router.get('/', isLoggedIn, getForYouTimeline);

export default router;
