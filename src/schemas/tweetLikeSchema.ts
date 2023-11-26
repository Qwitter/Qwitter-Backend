import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    TweetToggleLikeInput:
 *      type: object
 *      required:
 *        - tweet_id
 *      properties:
 *        tweet_id:
 *          type: string
 *          default: 150123
 *    TweetToggleLikeResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
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

export const getTweetLikesSchema = object({
  params: object({
    id: string({
      required_error: 'Tweet ID is required',
    }),
  }),
});