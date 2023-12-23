import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';
import { validate } from '../utils/validator';
import {
  checkPasswordSchema,
  googleSignUpSchema,
  loginSchema,
  updatePasswordSchema,
  changeEmailSchema,
} from '../schemas/authSchema';

const router = express.Router();
import {
  ForgetPasswordSchema,
  ResetPasswordSchema,
  SendVerificationEmailSchema,
  checkExistenceSchema,
  signUpSchema,
} from '../schemas/authSchema';
import { isLoggedIn, mobileLoggedIn } from '../middlewares/authMiddlewares';
/**
 * @openapi
 * '/api/v1/auth/google':
 *  get:
 *     tags:
 *     - Authentication
 *     summary: Register a user using Google (OAuth)
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  }),
);

/**
 * @openapi
 * '/api/v1/auth/signup':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignUpResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 */
router.route('/signup').post(validate(signUpSchema), authController.signUp);

/**
 * @openapi
 * '/api/v1/auth/check-existence':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Check validity of a userName or Email
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userNameOrEmail:
 *                 type: string
 *                 default: ahmed@gmail.com
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *                 default: true
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        description: Not Found
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *                 default: false
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 */
router
  .route('/check-existence')
  .post(validate(checkExistenceSchema), authController.checkExistence);

/**
 * @openapi
 * '/api/v1/auth/check-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Check Password of user through token and password
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 default: 1896156612
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correct:
 *                 type: boolean
 *                 default: true
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        description: Wrong Password
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correct:
 *                 type: boolean
 *                 default: false
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "404":
 *        $ref: '#/responses/404'
 *       "410":
 *        $ref: '#/responses/410'
 */
router
  .route('/check-password/')
  .post(
    isLoggedIn,
    validate(checkPasswordSchema),
    authController.checkPassword,
  );

/**
 * @openapi
 * '/api/v1/auth/login':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */
router.route('/login').post(validate(loginSchema), authController.login);
// validate(loginSchema),
/**
 * @openapi
 * '/api/v1/auth/verify-email/{token}':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Verify your email by checking the 6-digit token and the email address
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: ahmed@gmail.com
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/VerifyEmailResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 */
router
  .route('/verify-email/:token')
  .post(validate(SendVerificationEmailSchema), authController.verifyEmail);

/**
 * @openapi
 * '/api/v1/auth/send-verification-email/':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Verify your email by sending a verification email
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: ahmed@gmail.com
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SendVerificationEmailResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */
router
  .route('/send-verification-email/')
  .post(
    validate(SendVerificationEmailSchema),
    authController.sendVerificationEmail,
  );

/**
 * @openapi
 * '/api/v1/auth/forgot-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Send a Forgot Password request
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: ahmed@gmail.com
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForgotPasswordResponse'
 *       "404":
 *        description: Failure
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForgotPasswordResponse404'
 *
 *
 */
router
  .route('/forgot-password')
  .post(validate(ForgetPasswordSchema), authController.forgotPassword);

/**
 * @openapi
 * '/api/v1/auth/reset-password/{token}':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Verify the token of the user. No need for the email in payload
 *     requestBody:
 *      required: true
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResetPasswordSuccessResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */
router
  .route('/reset-password/:token')
  .post(validate(ResetPasswordSchema), authController.resetPassword);

/**
 * @openapi
 * '/api/v1/auth/google/login':
 *  get:
 *     tags:
 *     - Authentication
 *     summary: Login with google through token from mobile app
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */
router.route('/google/login').post(mobileLoggedIn, authController.logInGoogle);
/**
 * @openapi
 * '/api/v1/auth/google/signup':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Sign up with google through token and birthdate without password
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/GoogleSignUpRequest'
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */
router
  .route('/google/signup')
  .post(validate(googleSignUpSchema), authController.signUpGoogle);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: any, res) => {
    const user = req.user.user,
      token = req.user.token;
    if (user.registered === false) {
      const email = user._json.email;
      res.redirect(
        process.env.CLIENT_SIDE +
          `/i/flow/single-sign/callback?authenticationMethod=signup&token=${token}&email=${email}`,
      );
    } else {
      res.redirect(
        process.env.CLIENT_SIDE +
          `/i/flow/single-sign/callback?authenticationMethod=login&token=${token}`,
      );
    }
  },
);

/**
 * @openapi
 * '/api/v1/auth/change-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Change the password using only the token
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ChangePasswordSuccessResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */

router
  .route('/change-password/')
  .post(isLoggedIn, authController.changePassword);
/**
 * @openapi
 * '/api/v1/auth/update-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Change the password using the token and old password
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatePasswordResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */
router
  .route('/update-password/')
  .post(
    isLoggedIn,
    validate(updatePasswordSchema),
    authController.updatePassword,
  );

/**
 * @openapi
 * '/api/v1/auth/change-email':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Change the email using the token. The email should be verified first
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ChangeEmailRequest'
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ChangeEmailResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        description: Email Exists
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Email already exists
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 *
 *
 */


/**
 * @openapi
 * '/api/v1/auth/username-suggestions':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: get userName suggestions using only the token
 *     requestBody:
 *      required: false
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 default: zahran1234
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *     responses:
 *       "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/userNameSuggestionsResponse'
 *       "400":
 *        $ref: '#/responses/400'
 *       "401":
 *        $ref: '#/responses/401'
 *       "404":
 *        $ref: '#/responses/404'
 *       "403":
 *        $ref: '#/responses/403'
 *       "408":
 *        $ref: '#/responses/408'
 *       "409":
 *        $ref: '#/responses/409'
 *       "410":
 *        $ref: '#/responses/410'
 */

router
  .route('/username-suggestions')
  .post(isLoggedIn, authController.userNameSuggestions);

router
  .route('/change-email')
  .post(isLoggedIn, validate(changeEmailSchema), authController.changeEmail);

export default router;
