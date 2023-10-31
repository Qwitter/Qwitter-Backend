/**
 * @openapi
* '/api/message/send':
*  post:
*     tags:
*     - Messages
*     summary: Send New Message 
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*              $ref: '#/components/schemas/sendMessageRequest'
*     responses:
*      200:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/sendMessageResponse'
*      409:
*        description: Conflict
*      400:
*        description: Bad request
* '/api/message/delete':
 *  delete:
 *     tags:
 *     - Messages
 *     summary: Delete message 
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/deleteMessageRequest'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/deleteMessageResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
*/
