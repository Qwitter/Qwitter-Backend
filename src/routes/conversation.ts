/**
  @openapi
* '/api/v1/conversation/':
*  post:
*     tags:
*     - Conversations
*     summary: Create new conversation 
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*              $ref: '#/components/schemas/createConversationRequest'
*     responses:
*      200:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/createConversationResponse'
*      409:
*        description: Conflict
*      400:
*        description: Bad request
 *  get:
 *     tags:
 *     - Conversations
 *     summary: Get User Conversations 
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetUserConversationsResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
* '/api/v1/conversation/{conversationId}/user/{username}':
 *  post:
 *     tags:
 *     - Conversations
 *     summary: Add user to conversation 
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/addUserToConversationResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *  delete:
 *     tags:
 *     - Conversations
 *     summary: Remove user from conversation 
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/removeUserFromConversationResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request



*/
/**
  @openapi
* '/api/v1/conversation/{conversationId}':
*  get:
*     tags:
*     - Conversations
*     summary: Get Conversation Details
*     responses:
*      200:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/Conversation'
*      409:
*        description: Conflict
*      400:
*        description: Bad request
 *  delete:
 *     tags:
 *     - Conversations
 *     summary: Delete a certain conversation
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetUserConversationsResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request

*/
/**
  @openapi
* '/api/v1/conversation/search':
*  get:
*     tags:
*     - Conversations
*     parameters:
*       - name: authorization
*         in: header
*         description: ''
*         required: true
*         schema:
*           type: string
*       - name: q
*         in: query
*     summary: Search for messages, users and conversations
*     responses:
*      200:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/createConversationResponse'
*      409:
*        description: Conflict
*      400:
*        description: Bad request


*/
/**
  @openapi
* '/api/v1/conversation/{id}/photo':
*  post:
*     tags:
*     - Conversations
*     parameters:
*       - name: authorization
*         in: header
*         description: ''
*         required: true
*         schema:
*           type: string
*     summary: Add image for conversation
*     responses:
*      200:
*        description: Success
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/createConversationResponse'
*      409:
*        description: Conflict
*      400:
*        description: Bad request

*/
