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
 *        entityId:
 *          type: string
 *          default: 3847329049023859093
 *    addTweetresponse200:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        body:
 *          type: object
 *          properties:
 *            createdAt:
 *              type: string
 *              example: 2023-10-27 10:43:00
 *            id:
 *              type: string
 *              example: 1718938551163691349
 *            userName:
 *              type: string
 *              example: AhmedZahran2025
 *            replyCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            retweetCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            qouteCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            likesCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            text:
 *              type: string
 *              default: this is a tweet string
 *            source:
 *              type: string
 *              default: Iphone
 *            coordinates:
 *              type: string
 *              default: 30.037072,31.206344
 *            replyToTweetId:
 *              type: string
 *              default: 1718938551163691349
 *            retweetedId:
 *              type: string
 *              default: 1718938551163691349
 *            qouteTweetedId:
 *              type: string
 *              default: 1718938551163691349
 *            sensitive:
 *              type: boolean
 *              default: false
 *            entityId:
 *              type: string
 *              default: 3847329049023859093
 */

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
 *          format: int64
 *          default: 1
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
 *        body:
 *          type: object
 *          properties:
 *            createdAt:
 *              type: string
 *              example: 2023-10-27 10:43:00
 *            id:
 *              type: string
 *              example: 1718938551163691349
 *            userName:
 *              type: string
 *              example: AhmedZahran2025
 *            replyCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            retweetCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            qouteCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            likesCount:
 *              type: integer
 *              format: int64
 *              default: 0
 *            text:
 *              type: string
 *              default: this is a tweet string
 *            source:
 *              type: string
 *              default: Iphone
 *            coordinates:
 *              type: string
 *              default: 30.037072,31.206344
 *            replyToTweetId:
 *              type: string
 *              default: 1718938551163691349
 *            retweetedId:
 *              type: string
 *              default: 1718938551163691349
 *            qouteTweetedId:
 *              type: string
 *              default: 1718938551163691349
 *            sensitive:
 *              type: boolean
 *              default: false
 *            entityId:
 *              type: string
 *              default: 3847329049023859093
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
 *            type: integer
 *          default: [0,1,2]
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
 *            type: integer
 *          default: [1718938551163691349,1718938551163691350,1718938551163691351]
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
 *            type: string
 *          default: [AhmedZahran2025,Mrwhosetheboss]
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
 *            type: string
 *          default: [AhmedZahran2025,Mrwhosetheboss]
 */

/////////////////////////////////////////////////////////
