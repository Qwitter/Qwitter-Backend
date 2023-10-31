import { object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 * 
 *    UserInteractionInput:
 *      type: object
 *      required:
 *        - target_user_id
 *      properties:
 *        target_user_id:
 *          type: int
 *          default: 412423123
 *    UserInteractionResponse:
 *      type: object
 *      properties:
 *        operation_succeeded:
 *          type: boolean
 *          default: true
 * 
 */



/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: int
 *          default: 234892837
 *        user_name:
 *          type: string
 *          default: johndoe123
 *        name:
 *          type: string
 *          default: John Doe
 *        url:
 *          type: string
 *          default: www.johndoe.com
 *        description:
 *          type: string
 *          default: Hi i am john doe 
 *        protected:
 *          type: boolean
 *          default: false
 *        verified:
 *          type: boolean
 *          default: true
 *        followers_count:
 *          type: int
 *          default: 12312
 *        followings_count:
 *          type: int
 *          default: 1932
 *        tweets_count:
 *          type: string
 *          default: 231
 *        profile_banner_url:
 *          type: string
 *          default: ""
 *        profile_image_url_https:
 *          type: string
 *          default: https://notdeterminedyet.com/profile_banners/819797/1348102824
 *        default_profile:
 *          type: boolean
 *          default: false
 *        default_profile_image:
 *          type: boolean
 *          default: true
 */



/**
 * @openapi
 * components:
 *  schemas:
 * 
 *    UploadImageInput:
 *      type: object
 *      required:
 *        - img
 *      properties:
 *        img:
 *          type: string 
 *          format: binary
 *    UploadImageResponse:
 *      type: object
 *      properties:
 *        operation_status:
 *          type: boolean
 *          default: true
 *        img_url:
 *          type: string
 * 
 */



/**
 * @openapi
 * components:
 *  schemas:
 * 
 *    UserProfile:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        Location:
 *          type: string
 *        url:  
 *          type: string
 *        birth_date:  
 *          type: string
 */

const createUserSchemaPayload = {
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short - should be 6 chars minimum'),
    passwordConfirmation: string({
      required_error: 'passwordConfirmation is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
};

export const createUserSchema = object({
  ...createUserSchemaPayload,
});

// Omit type is used to create a new type by excluding specified properties from an existing type.
// It helps you create a new type that is a variation of an existing type but without certain properties.
export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
