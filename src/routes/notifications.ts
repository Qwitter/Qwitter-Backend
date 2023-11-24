import express from 'express';
const router = express.Router();
/**
 * @openapi
 * '/api/v1/notifications/{userId}':
 *   get:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: ''
 *         required: true
 *     tags:
 *       - Notifications
 *     summary: Returns a list of notifications for a user
 *     security:
 *       - bearerAuth: []   # <-- Bearer Token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetNotificationsResponse'
 *         examples:
 *           application/json:
 *             - id: 1
 *               name: 'Ahmed Helmy'
 *       "400":
 *         $ref: '#/responses/400'
 *       "401":
 *         $ref: '#/responses/401'
 *       "404":
 *         $ref: '#/responses/404'
 *       "403":
 *         $ref: '#/responses/403'
 *       "408":
 *         $ref: '#/responses/408'
 *       "409":
 *         $ref: '#/responses/409'
 *       "410":
 *         $ref: '#/responses/410'
 */

router.route('/:userID').get();
