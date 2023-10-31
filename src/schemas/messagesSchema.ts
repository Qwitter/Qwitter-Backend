import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    sendMessageRequest:
 *      type: object
 *      required:
 *        - user_id
 *        - conversation_id
 *        - text
 *        - reply_id
 *        - media
 *      properties:
 *        user_id:
 *          type: string
 *        conversation_id:
 *          type: string
 *        text:
 *          type: string
 *        reply_id:
 *          type: string
 *        media:
 *          type: string
 *    sendMessageResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean 

 *    deleteMessageRequest:
 *      type: object
 *      required:
 *        - user_id
 *        - conversation_id
 *        - message_id
 *      properties:
 *        user_id:
 *          type: string
 *        conversation_id:
 *          type: string
 *        message_id:
 *          type: string
 *    deleteMessageResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 
 */
  
const createMessagePayload = {
  body: object({
    user_id: string({
      required_error: 'User ID is required',
    }),
    conversation_id: string({
      required_error: 'Conversation ID is required',
    }),
    text: string({
      required_error: 'Message Text is required',
    }),
  }),
};

const deleteMessagePayload = {
  body: object({
    user_id: string({
      required_error: 'User ID is required',
    }),
    conversation_id: string({
      required_error: 'Conversation ID is required',
    }),
    message_id: string({
      required_error: 'Message To Remove ID is required',
    }),  
  }),
};
  

export const addUserToConversationSchema = object({
  ...createMessagePayload,
  ...deleteMessagePayload
});
