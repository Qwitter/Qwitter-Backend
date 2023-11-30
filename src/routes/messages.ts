/**
 * @openapi
 * '/api/v1/conversation/{conversationId}/message':
 *  post:
 *     tags:
 *     - Conversations
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
 *  delete:
 *     tags:
 *     - Conversations
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
