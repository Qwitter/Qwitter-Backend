import { object, string, TypeOf, optional } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *
 *    UserInteractionInput:
 *      type: object
 *      required:
 *        - target_user_name
 *      properties:
 *        target_user_name:
 *          type: string
 *          default: jhondoe41123
 *    UserInteractionResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *    UploadImageResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          default: Image uploaded successfully
 *        user:
 *          $ref: '#/components/schemas/User'
 *
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        userName:
 *          type: string
 *          default: johndoe123
 *        name:
 *          type: string
 *          default: Ahmed Zahran
 *        birthDate:
 *          type: string
 *          default: 2020-03-09T22:18:26.625Z
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
 *        followersCount:
 *          type: int
 *          default: 12312
 *        followingCount:
 *          type: int
 *          default: 1932
 *        createdAt:
 *          type: string
 *          default: 2020-03-09T22:18:26.625Z
 *        profileBannerUrl:
 *          type: string
 *          default: https://notdeterminedyet.com/profile_banners/819797/1348102824
 *        profileImageUrl:
 *          type: string
 *          default: https://notdeterminedyet.com/profile_banners/819797/1348102824
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
 *          default: "any string"
 *          required: true
 *        description:
 *          type: string
 *          default: "any string"
 *        Location:
 *          type: string
 *          default: "egypt"
 *        url:
 *          type: string
 *
 *        birth_date:
 *          type: string
 *          required: true
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
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

export const updateUserNameSchemaPayload = object({
  body: object({
    userName: string({
      required_error: 'userName is required',
    }).min(5),
  }),
});

export const createUserSchema = object({
  ...createUserSchemaPayload,
});

// Omit type is used to create a new type by excluding specified properties from an existing type.
// It helps you create a new type that is a variation of an existing type but without certain properties.
export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;

export const putUserProfileReqSchema = object({
  body: object({
    name: string().min(1).max(50),
    description: optional(string()),
    location: optional(string()),
    url: optional(string().url()),
    birth_date: string().datetime(),
  }),
});

export const getUserSchema = object({
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
