/**
 * @openapi
* '/api/conversation/create':
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
* '/api/conversation/add-user':
 *  post:
 *     tags:
 *     - Conversations
 *     summary: Add user to conversation 
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/addUserToConversationRequest'
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
 * '/api/conversation/remove-user':
 *  delete:
 *     tags:
 *     - Conversations
 *     summary: Remove user from conversation 
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/removeUserFromConversationRequest'
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


 * '/api/conversation/':
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

 * '/api/conversation/unseen':
 *  get:
 *     tags:
 *     - Conversations
 *     summary: Get User Conversations Unseen Countn
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetUserUnseenConversationsCountResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request


*/
