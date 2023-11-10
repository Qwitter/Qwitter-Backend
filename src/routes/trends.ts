/**
 * @openapi
* '/api/v1/trends':
*  get:
*     tags:
*     - Trends
*     summary: Get Trends 
*     responses:
*      200:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/GetTrends'
*      409:
*        description: Conflict
*      400:
*        description: Bad request 

* '/api/v1/trends?trend={word}':
*  get:
*     parameters:
*       - name: authorization
*         in: header
*         description: ''
*         required: true
*         schema:
*           type: string
*       - name: word
*         in: query
*         description: Word to search
*         required: true
*         schema:
*           type: string
*     tags:
*     - Trends
*     summary: Get Tweets in Trend
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
