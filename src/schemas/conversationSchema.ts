import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    conversation:
 *      type: object
 *      required:
 *        - id
 *        - name
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string

*    createConversationRequest:
 *      type: object
 *      required:
 *        - conversation_name
 *        - users
 *      properties:
 *        conversation_name:
 *          type: string
 *        users_to_add:
 *          type: array
 *          example: ["username_1", "username_2", "username_3"]
 *    createConversationResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string 


*    addUserToConversationRequest:
 *      type: object
 *      required:
 *        - conversation_id
 *        - user_id
 *        - user_to_add_id
 *      properties:
 *        conversation_id:
 *          type: string
 *        user_id:
 *          type: string
 *        user_to_add_id:
 *          type: string
 *    addUserToConversationResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 
 *    removeUserFromConversationRequest:
 *      type: object
 *      required:
 *        - conversation_id
 *        - user_id
 *        - user_to_remove_id
 *      properties:
 *        conversation_id:
 *          type: string
 *        user_id:
 *          type: string
 *        user_to_remove_id:
 *          type: string
 *    removeUserFromConversationResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 
 *    GetUserConversationsResponse:
 *      type: object
 *      properties:
 *        unseen:
 *          type: integer
 *        conversations:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              name:
 *                type: string
 *              status:
 *                type: string 
 *              lastMessage:
 *                $ref: '#/components/schemas/Message'
 * 
 * 
 *    Message:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *        date:
 *          type: string
 *        userName: 
 *          type: string
 *        userPhoto: 
 *          type: string
 *        media:
 *          type: object
 *          properties:
 *            url:
 *              type: string 
 *            type:
 *              type: string 
 *         
 *    Conversation:
 *      type: object
 *      properties:
 *        messages:
 *          type: array
 *          items:
 *            $ref: '#components/schemas/Message' 
 *        name:
 *          type: string 
 *        photo: 
 *          type: string 
 *        users:
 *         type: array 
 *         items:
 *           type: object 
 *           properties:
 *             userName: 
 *               type: string 
 *             userPhoto:
 *               type: string
 *            
 */

const createConversationPayload = {
  body: object({
    user_id: string({
      required_error: 'User ID is required',
    }),
    conversation_id: string({
      required_error: 'Conversation ID is required',
    }),
    users: string({
      required_error: 'Users to be added are required',
    }),
  }),
};

const addUserToConversationPayload = {
  body: object({
    conversation_id: string({
      required_error: 'Conversation ID is required',
    }),
    user_id: string({
      required_error: 'User ID is required',
    }),
    user_to_add_id: string({
      required_error: 'User To Add ID is required',
    }),
  }),
};

const removeUserFromConversationPayload = {
  body: object({
    conversation_id: string({
      required_error: 'Conversation ID is required',
    }),
    user_id: string({
      required_error: 'User ID is required',
    }),
    user_to_remove_id: string({
      required_error: 'User To Remove ID is required',
    }),
  }),
};

export const addUserToConversationSchema = object({
  ...addUserToConversationPayload,
  ...createConversationPayload,
  ...removeUserFromConversationPayload,
});
