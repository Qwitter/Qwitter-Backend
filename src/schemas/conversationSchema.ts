import { object, string } from 'zod';

/**
 * @openapi
 * openapi: 3.0.0
 * info:
 *   title: Conversation API
 *   version: 1.0.0
 * components:
 *   schemas:
 *     # Definition for a conversation object
 *     conversation:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *
 *     # Request payload for creating a conversation
 *     createConversationRequest:
 *       type: object
 *       required:
 *         - conversation_name
 *         - users
 *       properties:
 *         conversation_name:
 *           type: string
 *         users:
 *           type: array
 *           example: ["username_1", "username_2", "username_3"]
 *
 *     # Response payload for creating a conversation
 *     createConversationResponse:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           default: direct
 *         id:
 *           type: string
 *         name:
 *           type: string
 *
 *     # Response payload for searching users to add to a conversation
 *     conversationSearchUserToAddResponse:
 *       type: object
 *       required:
 *         - users
 *       properties:
 *         users:
 *           type: array
 *           example: [{userName: "username_1", eligible: true}]
 *
 *     # Request payload for adding users to a conversation
 *     addUserToConversationRequest:
 *       type: object
 *       required:
 *         - users
 *       properties:
 *         users:
 *           type: array
 *           example: ["username_1", "username_2", "username_3"]
 *
 *     # Response payload for adding users to a conversation
 *     addUserToConversationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *
 *     # Request payload for removing a user from a conversation
 *     removeUserFromConversationRequest:
 *       type: object
 *       required:
 *         - conversation_id
 *         - user_id
 *         - user_to_remove_id
 *       properties:
 *         conversation_id:
 *           type: string
 *         user_id:
 *           type: string
 *         user_to_remove_id:
 *           type: string
 *
 *     # Response payload for removing a user from a conversation
 *     removeUserFromConversationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *
 *     # Response payload for getting user conversations
 *     GetUserConversationsResponse:
 *       type: object
 *       properties:
 *         unseen:
 *           type: integer
 *         conversations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               lastMessage:
 *                 $ref: '#/components/schemas/Message'
 *
 *     # Definition for a message object
 *     Message:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         id:
 *           type: string
 *         date:
 *           type: string
 *         userName:
 *           type: string
 *         userPhoto:
 *           type: string
 *         media:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *             type:
 *               type: string
 *
 *     # Definition for a conversation object with messages and users
 *     Conversation:
 *       type: object
 *       properties:
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#components/schemas/Message'
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           default: group
 *         photo:
 *           type: string
 *         users:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               userPhoto:
 *                 type: string
 */

export const createConversationPayloadSchema = object({
  body: object({
    conversation_name: string({
      required_error: 'Conversation name is required',
    }),
    users: string({
      required_error: 'Users to be added are required',
    }).array(),
  }),
});

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
  ...removeUserFromConversationPayload,
});
