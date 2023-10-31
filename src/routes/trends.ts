/**
 * @openapi
* '/api/trends':
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

* '/api/trends?trend={word}':
*  get:
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
