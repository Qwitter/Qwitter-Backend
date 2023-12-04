/**
 * @openapi
 * components:
 *  schemas:
 *    GetTrends:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        trends:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              trend:
 *                type: string
 *              count:
 *                type: integer
 *          example:
 *            - trend: "#Trend1"
 *              count: 10000
 *            - trend: "#Trend2"
 *              count: 8000
 *            - trend: "#Trend3"
 *              count: 6000
 */