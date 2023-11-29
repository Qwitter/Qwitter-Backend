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

export const getTweetTimeline = object({
  query: object({
    q: string().optional(),
    hashtag: string().optional(),
    page: string()
      .refine(
        (value) => {
          const numericValue = parseInt(value);
          return !isNaN(numericValue) && numericValue > 0;
        },
        {
          message: 'Invalid page number',
        },
      )
      .optional(),
    limit: string()
      .refine(
        (value) => {
          const numericValue = parseInt(value);
          return !isNaN(numericValue) && numericValue > 0;
        },
        {
          message: 'Invalid limit number',
        },
      )
      .optional(),
  }),
});

export const getProfileTab = object({
  params: object({
    username: string({
      required_error: 'username is required',
    }),
  }),
  query: object({
    page: string()
      .refine(
        (value) => {
          const numericValue = parseInt(value);
          return !isNaN(numericValue) && numericValue > 0;
        },
        {
          message: 'Invalid page number',
        },
      )
      .optional(),
    limit: string()
      .refine(
        (value) => {
          const numericValue = parseInt(value);
          return !isNaN(numericValue) && numericValue > 0;
        },
        {
          message: 'Invalid limit number',
        },
      )
      .optional(),
  }),
});


export const likeUnlikeTweetSchema = object({
  params: object({
    id: string({
      required_error: 'Tweet ID is required',
    }),
  }),
});

