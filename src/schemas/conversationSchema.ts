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
 *        - user_id
 *        - conversation_name
 *        - users
 *      properties:
 *        user_id:
 *          type: string
 *        conversation_name:
 *          type: string
 *        users_to_add:
 *          type: array
 *          example: ["user_id_1", "user_id_2", "user_id_3"]
 *    createConversationResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean 


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
 *        success:
 *          type: boolean
 
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
 *        success:
 *          type: boolean
 
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
 *            example: {"id": 1, "name": "Group"}
 *      example:
 *        unseen: 2
 *        conversations: 
 *          - id: 1
 *            name: "Group"
 *          - id: 2
 *            name: "Another Group"
   
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
  ...removeUserFromConversationPayload
});
