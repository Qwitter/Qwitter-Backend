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
 */
