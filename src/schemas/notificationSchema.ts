import { object } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    Notification:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          default: '12345'
 *        text:
 *          type: string
 *          default: Ahmed Helmy liked your photo
 *        seen:
 *          type: boolean
 *          default: false
 *        senderId:
 *          type: string
 *          default: 5641651
 *        createdAt:
 *          type: string
 *          default: '19-08-2023'
 *        url:
 *          type: string
 *          description: 'Its the url for the activity. If its liking a tweet it will be tweet url'
 *          default: 'http://qwitter/tweet/123'
 *    GetNotificationsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Notification'
 *
 */

const GetNotificationsPayload = {};
export const GetNotificationsSchema = object({
  ...GetNotificationsPayload,
});
