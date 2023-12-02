import express from 'express';
import { validate } from '../utils/validator';
import { isLoggedIn } from '../middlewares/authMiddlewares';
import {
  editConversationName,
  searchForMembers,
} from '../controllers/conversationController';
import {
  updateConversationNamePayload,
  findMemberConversationPayload,
  messsageSchema,
} from '../schemas/conversationSchema';
import { userInConversation } from '../middlewares/conversationMiddleware';
import { uploadMediaMessageMiddleware } from '../middlewares/uploadMiddleware';
const router = express.Router();
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
* '/api/v1/conversation/{conversationId}/user/':
 *  post:
 *     tags:
 *     - Conversations
 *     summary: Add user to conversation 
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*              $ref: '#/components/schemas/addUsers'
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
 *     summary: Search for new users to join conversation. It should return for each user whether he can be added or not and whether he is in the group already or not. Eligibility should be true if the user is not in the group and the user can be added 
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/conversationSearchUserToAddResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
*/

router
  .route('/:id/user')
  .get(isLoggedIn, validate(findMemberConversationPayload), searchForMembers);

/**
  @openapi
* '/api/v1/conversation/{conversationId}':
*  get:
*     tags:
*     - Conversations
*     summary: Get Conversation Details. It should update the status of the conversation to seen when fetched
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
 *     summary: It should remove the conversation from the user conversations
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
/**
  @openapi
* '/api/v1/conversation/{id}/name':
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
*     summary: Edit Conversation Name
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
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
router
  .route('/:id/name')
  .post(
    isLoggedIn,
    validate(updateConversationNamePayload),
    editConversationName,
  );

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
 *     summary: Delete message. Currently, it deletes the message iff the user is the message creator. It deletes it for all.
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
router
  .route('/:id/message')
  .post(
    isLoggedIn,
    userInConversation,
    uploadMediaMessageMiddleware,
    validate(messsageSchema),
    editConversationName,
  );
export default router;
