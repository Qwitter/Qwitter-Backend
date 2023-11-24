import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    TweetToggleLikeInput:
 *      type: object
 *      required:
 *        - used_id
 *        - tweet_id
 *      properties:
 *        used_id:
 *          type: string
 *          default: 1215
 *        tweet_id:
 *          type: string
 *          default: 150123
 *    TweetToggleLikeResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        is_liked:
 *          type: boolean
 */

const tweetToggleLikeSchemaPayload = {
  body: object({
    used_id: string({
      required_error: 'User ID is required',
    }),
    tweet_id: string({
      required_error: 'Tweet ID is required',
    }),
  }),
};

export const tweetLikeSchema = object({
  ...tweetToggleLikeSchemaPayload,
});


export const getTweetRepliesSchema = object({
  params: object({
    id: string({
      required_error: 'Tweet ID is required',
    }),
  }),
});