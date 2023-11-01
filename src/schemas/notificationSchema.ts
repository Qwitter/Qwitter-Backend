import { object } from 'zod';
/**
 * @openapi
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           default: '12345'
 *           description: Unique identifier for the notification.
 *         text:
 *           type: string
 *           default: 'Ahmed Helmy liked your photo'
 *           description: The text content of the notification.
 *         seen:
 *           type: boolean
 *           default: false
 *           description: Indicates if the notification has been seen or not.
 *         senderId:
 *           type: string
 *           default: '5641651'
 *           description: The unique identifier of the sender.
 *         createdAt:
 *           type: string
 *           default: '19-08-2023'
 *           description: The date and time when the notification was created.
 *         url:
 *           type: string
 *           description: 'Its the URL for the activity. If its liking a tweet, it will be the tweet URL.'
 *           default: 'http://qwitter/tweet/123'
 *     GetNotificationsResponse:
 *       type: object
 *       properties:
 *         unSeenCount:
 *           type: number
 *           description: Number of unseen notifications.
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *           description: List of notifications.
 */

const GetNotificationsPayload = {};
export const GetNotificationsSchema = object({
  ...GetNotificationsPayload,
});
