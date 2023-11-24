import { object, string } from 'zod';

//entity
/**
 * @openapi
 * components:
 *   schemas:
 *     entityArray:
 *       type: object
 *       properties:
 *         hasthtags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/hashtag'
 *         media:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/media'
 *         mentions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/mention'
 *         urls:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/url'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     media:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *           example: 'qwitter/photos/213902323'
 *           description: The value of the entity.
 *         type:
 *           type: string
 *           example: 'photo'
 *           description: The type of the entity (e.g., 'hashtag', 'photo').
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     hashtag:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *           example: '#Palestine'
 *           description: The value of the entity.
 */

//entity
/**
 * @openapi
 * components:
 *   schemas:
 *     url:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *           example: 'qwitter/photos/213902323'
 *           description: The value of the entity.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     mention:
 *       type: object
 *       properties:
 *         mentionedUsername:
 *           type: string
 *           example: 'ahmedoshelmy'
 *           description: The value of the entity.
 */

//tweet
/**
 * @openapi
 * components:
 *  schemas:
 *    tweet:
 *      type: object
 *      properties:
 *        createdAt:
 *          type: string
 *          example: 2023-10-27 10:43:00
 *        id:
 *          type: string
 *          example: 1718938551163691349
 *        userName:
 *          type: string
 *          example: AhmedZahran2025
 *        replyCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        retweetCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        qouteCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        likesCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        text:
 *          type: string
 *          default: this is a tweet string
 *        source:
 *          type: string
 *          default: Iphone
 *        coordinates:
 *          type: string
 *          default: 30.037072,31.206344
 *        replyToTweetId:
 *          type: string
 *          default: 1718938551163691349
 *        retweetedId:
 *          type: string
 *          default: 1718938551163691349
 *        qouteTweetedId:
 *          type: string
 *          default: 1718938551163691349
 *        sensitive:
 *          type: boolean
 *          default: false
 *        entities:
 *          $ref: '#/components/schemas/entityArray'
 *
 */

//reply
/**
 * @openapi
 * components:
 *  schemas:
 *    reply:
 *      type: object
 *      properties:
 *        createdAt:
 *          type: string
 *          example: 2023-10-27 10:43:00
 *        id:
 *          type: string
 *          example: 1718938551163691349
 *        userName:
 *          type: string
 *          example: AhmedZahran2025
 *        replyCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        retweetCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        qouteCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        likesCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        text:
 *          type: string
 *          default: this is a tweet string
 *        source:
 *          type: string
 *          default: Iphone
 *        coordinates:
 *          type: string
 *          default: 30.037072,31.206344
 *        replyToTweetId:
 *          type: string
 *          default: 1718938551163691349
 *        sensitive:
 *          type: boolean
 *          default: false
 *        entities:
 *          $ref: '#/components/schemas/entityArray'
 */

//qoute
/**
 * @openapi
 * components:
 *  schemas:
 *    qoute:
 *      type: object
 *      properties:
 *        createdAt:
 *          type: string
 *          example: 2023-10-27 10:43:00
 *        id:
 *          type: string
 *          example: 1718938551163691349
 *        userName:
 *          type: string
 *          example: AhmedZahran2025
 *        replyCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        retweetCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        qouteCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        likesCount:
 *          type: integer
 *          format: int64
 *          default: 0
 *        text:
 *          type: string
 *          default: this is a tweet string
 *        source:
 *          type: string
 *          default: Iphone
 *        coordinates:
 *          type: string
 *          default: 30.037072,31.206344
 *        qouteTweetedId:
 *          type: string
 *          default: 1718938551163691349
 *        sensitive:
 *          type: boolean
 *          default: false
 *        entities:
 *          $ref: '#/components/schemas/entityArray'
 */

//Create tweet
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateTweetPayload:
 *      type: object
 *      properties:
 *        text:
 *          type: string
 *          default: this is a tweet string
 *        source:
 *          type: string
 *          default: Iphone
 *        coordinates:
 *          type: string
 *          default: 30.037072,31.206344
 *        replyToTweetId:
 *          type: string
 *          default: 1718938551163691349
 *        retweetedId:
 *          type: string
 *          default: 1718938551163691349
 *        qouteTweetedId:
 *          type: string
 *          default: 1718938551163691349
 *        sensitive:
 *          type: boolean
 *          default: false
 *        media:
 *          type: array
 *          items:
 *           type: string
 *           default: jikshd3847329049023859093
 *    addTweetresponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        body:
 *          $ref: '#/components/schemas/tweet'
 */

const CreateTweetPayload = {
  body: object({
    text: string({
      required_error: 'Tweet Text should not be empty',
    }),
    source: string({
      required_error: 'Please indicate the source of the request [Iphone,....]',
    }),
    coordinates: string().optional(),
    replyToTweetId: string().optional(),
    retweetedId: string().optional(),
    sensitive: string(),
  }),
};
export const CreateTweetSchema = object({
  ...CreateTweetPayload,
});

/////////////////////////////////////////////////////////

//Delete tweet by Id
/**
 * @openapi
 * components:
 *  schemas:
 *    deleteTweetResponse204:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        id:
 *          type: integer
 *          format: string
 *          default: 1719147494591049939
 *        deletedAt:
 *          type: string
 *          default: 2023-10-27 10:43:00
 */

/////////////////////////////////////////////////////////

//Get tweet by id
/**
 * @openapi
 * components:
 *  schemas:
 *    getTweetResponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        tweet:
 *          $ref: '#/components/schemas/tweet'
 *        user:
 *          $ref: '#/components/schemas/User'

 *    
 * 
 */

/////////////////////////////////////////////////////////

//Get replies of a tweet by Id
/**
 * @openapi
 * components:
 *  schemas:
 *    getRepliesOfTweetResponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        replies:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/reply'
 */

/////////////////////////////////////////////////////////

//Get qouteRetweets of a tweet by Id
/**
 * @openapi
 * components:
 *  schemas:
 *    getQouteRetweetsOfTweetResponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        qoutes:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/qoute'
 */

//Get likers of a tweet by Id
/**
 * @openapi
 * components:
 *  schemas:
 *    getLikersOfTweetResponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        likers:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/User'
 */

//Get retweeters of a tweet by Id
/**
 * @openapi
 * components:
 *  schemas:
 *    getRetweetersOfTweetResponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        retweeters:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/User'
 */

/////////////////////////////////////////////////////////
