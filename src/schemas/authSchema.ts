import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginRequest:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: ahmed.helmy@qwitter.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    SignUpRequest:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: ahmed.helmy@qwitter.com
 *        name:
 *          type: string
 *          default: Ahmed Helmy
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    ForgotPasswordRequest:
 *      type: object
 *      required:
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    SignUpResponse:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 *    LoginResponse:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 *        user:
 *          $ref: '#/components/schemas/User'
 *    VerifyEmailResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          default: "Your account has been successfully verified"
 */

const ResetPasswordPayload = {
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email address'),
  }),
};
export const ResetPasswordSchema = object({
  ...ResetPasswordPayload,
});

const SendVerificationEmailPayload = {
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email address'),
  }),
};
export const SendVerificationEmailSchema = object({
  ...SendVerificationEmailPayload,
});

export const signUpSchema = object({
  body: object({
    name: string().min(1).max(50),
    email: string().email(),
    password: string().min(8),
    birthDate: string().datetime(),
  }),
});
