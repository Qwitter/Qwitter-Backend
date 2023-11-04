import express from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../utils/validator';
import {loginSchema} from '../schemas/authSchema'

const router = express.Router();

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
router.route('/google').get();

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
 *              $ref: '#/components/schemas/CreateUserInput'
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
 */
router.route('/signup').post();

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
router.route('/login').post(validate(loginSchema),authController.login);
// validate(loginSchema),
/**
 * @openapi
 * '/api/v1/auth/forget-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ForgotPasswordRequest'
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
router.route('/forget-password').post();

/**
 * @openapi
 * '/api/v1/auth/verify-email/{token}':
 *  get:
 *     tags:
 *     - Authentication
 *     summary: Verify your email by clicking on the provided link
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
 *
 *
 */
router.route('/verify-email/:token').get();


export default router;
