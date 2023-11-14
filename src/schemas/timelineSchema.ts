import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    ReturnListOfTweets:
 *      type: object
 *      properties:
 *        tweets:
 *          type: array 
 *          items:
 *            $ref: '#/components/schemas/tweet'
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
