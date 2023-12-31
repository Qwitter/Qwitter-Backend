import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    sendMessageRequest:
 *      type: object
 *      required:
 *        - text
 *        - replyId
 *        - media
 *      properties:
 *        text:
 *          type: string
 *        replyId:
 *          type: string
 *        media:
 *          type: string
 *    sendMessageResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string 

 *    deleteMessageRequest:
 *      type: object
 *      required:
 *        - message_id
 *      properties:
 *        message_id:
 *          type: string
 *    deleteMessageResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 
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

const deleteMessageBody = {
  body: object({
    message_id: string({
      required_error: 'Message To Remove ID is required',
    }),
  }),
};
export const deleteMessageSchema = object({
  ...deleteMessageBody,
});

export const addUserToConversationSchema = object({
  ...createMessagePayload,
  ...deleteMessagePayload,
});
