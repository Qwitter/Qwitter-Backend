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
import * as conversationController from '../controllers/conversationController';
import { createConversationPayloadSchema } from '../schemas/conversationSchema';
const router = express.Router();

conversationController;
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
*      401:
*        description: not all users are found
*      402:
*        description: can't create conversation with yourself
*      404:
*        description: Conversation already exists
*      403:
*        description: no users provided

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
 * 
 * '/api/v1/conversation/user/':
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
 *     summary: Search for new users to create conversations with. 
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

router
  .route('/user')
  .get(isLoggedIn, validate(findMemberConversationPayload), searchForMembers);

router
  .route('/')
  .post(
    isLoggedIn,
    validate(createConversationPayloadSchema),
    conversationController.createConversation,
  );
router.route('/').get(isLoggedIn, conversationController.getConversation);
router
  .route('/:id')
  .delete(isLoggedIn, conversationController.deleteConversation);

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
*              $ref: '#/components/schemas/deleteConversationResponse'

*      409:
*        description: Conflict
*      400:
*        description: Bad request
*      404:
*        description: Conversation not found
*      
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
* '/api/v1/conversation/{id}':
*  put:
*     tags:
*     - Conversations
*     parameters:
*       - name: authorization
*         in: header
*         description: ''
*         required: true
*         schema:
*           type: string
*     summary: Edit Conversation Name and photo 
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
  .route('/:id')
  .put(
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
    conversationController.postMessage,
  );
export default router;
