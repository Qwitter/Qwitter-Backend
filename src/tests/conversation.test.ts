// import * as conversationController from '../controllers/conversationController';
import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendNotification } from '../utils/notifications';

jest.mock('../utils/notifications'); // this happens automatically with automocking
jest.mocked(sendNotification).mockImplementation(() => {
  return {
    method: {},
  };
});

//mocking jwt and hashing
jest.mock('bcrypt');
bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
jest.mock('jsonwebtoken');
jwt.sign = jest.fn().mockResolvedValue('generated_token');
jwt.verify = jest.fn().mockResolvedValue({
  id: 'eac0ece1',
  iat: 1699498302,
  exp: 1707274302,
});

describe('searchForMembers Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('No query in request should repond by 400', async () => {
          const user = {
            id: 'eac0ece1',
            name: 'Zahran',
            birthDate: new Date(),
            location: null,
            url: null,
            description: null,
            protected: false,
            verified: false,
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date(),
            deletedAt: null,
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@gmail.com',
            userName: 'ahmedzahran12364',
            password:
              '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
            passwordChangedAt: null,
            passwordResetToken: null,
            passwordResetExpires: null,
            google_id: null,
          };
          prismaMock.user.findFirst.mockResolvedValueOnce(user);
          const response = await Request(app)
            .get('/api/v1/conversation/135435/user')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(400);
          expect(response.body.issues[0].message).toEqual(
            'Conversation name is required',
          );
        });
        test('No conversation by that Id should repond by 400', async () => {
          const user = {
            id: 'eac0ece1',
            name: 'Zahran',
            birthDate: new Date(),
            location: null,
            url: null,
            description: null,
            protected: false,
            verified: false,
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date(),
            deletedAt: null,
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@gmail.com',
            userName: 'ahmedzahran12364',
            password:
              '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
            passwordChangedAt: null,
            passwordResetToken: null,
            passwordResetExpires: null,
            google_id: null,
          };
          prismaMock.user.findFirst.mockResolvedValueOnce(user);
          prismaMock.userConversations.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .get('/api/v1/conversation/kjhk/user?q=djksfh')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Bad Request');
        });
        test('Users matched are returned should repond by 200', async () => {
          const user = {
            id: 'eac0ece1',
            name: 'Zahran',
            birthDate: new Date(),
            location: null,
            url: null,
            description: null,
            protected: false,
            verified: false,
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date(),
            deletedAt: null,
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@gmail.com',
            userName: 'ahmedzahran12364',
            password:
              '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
            passwordChangedAt: null,
            passwordResetToken: null,
            passwordResetExpires: null,
            google_id: null,
          };
          prismaMock.user.findFirst.mockResolvedValueOnce(user);
          const userConversation = {
            userId: 'dljfjkdsf',
            conversationId: 'dkfjhdsjkhf',
            seen: true,
            dateJoined: new Date(),
          };
          prismaMock.userConversations.findFirst.mockResolvedValue(
            userConversation,
          );
          prismaMock.user.findMany.mockResolvedValueOnce([user]);

          const response = await Request(app)
            .get('/api/v1/conversation/kjhk/user?q=djksfh')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.users).toBeDefined();
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          prismaMock.user.findFirst.mockResolvedValue(null);

          const response = await Request(app)
            .get('/api/v1/conversation/123456/user')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(404);
          expect(response.body.message).toStrictEqual('User not found');
        });
      });
    });
    describe('auth_key is invalid', () => {
      test('should respond with status 409 token expired', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({
          id: 'eac0ece1',
          iat: 1699498302,
          exp: 0,
        });

        const response = await Request(app)
          .get('/api/v1/conversation/123456/user')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .get('/api/v1/conversation/123456/user')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual(
          'Invalid access credentials',
        );
      });
    });
  });
  describe('auth_key not found in header', () => {
    test('should respond with status 401', async () => {
      const response = await Request(app).get(
        '/api/v1/conversation/123456/user',
      );
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('postConversationUsers Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        describe('user in conversation', () => {
          test('Conversation not found should repond by 500', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            const userConversation = {
              userId: 'dljfjkdsf',
              conversationId: 'dkfjhdsjkhf',
              seen: true,
              dateJoined: new Date(),
            };
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(
              userConversation,
            );
            prismaMock.conversation.findUnique.mockResolvedValueOnce(null);
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(500);
            expect(response.body.message).toEqual('Oops! Something went wrong');
          });
          test('Conversation is not group should repond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            const userConversation = {
              userId: 'dljfjkdsf',
              conversationId: 'dkfjhdsjkhf',
              seen: true,
              dateJoined: new Date(),
            };
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(
              userConversation,
            );
            const conversation = {
              id: 'dsjfdsf',
              name: 'dfjdskf',
              isGroup: false,
              photo: null,
            };
            prismaMock.conversation.findUnique.mockResolvedValueOnce(
              conversation,
            );
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual(
              'You can not add users to direct messages',
            );
          });
          test('No users to add should repond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            const userConversation = {
              userId: 'dljfjkdsf',
              conversationId: 'dkfjhdsjkhf',
              seen: true,
              dateJoined: new Date(),
            };
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(
              userConversation,
            );
            const conversation = {
              id: 'dsjfdsf',
              name: 'dfjdskf',
              isGroup: true,
              photo: null,
            };
            prismaMock.conversation.findUnique.mockResolvedValueOnce(
              conversation,
            );
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('No users to add');
          });
          test('Not all users are found should repond by 404', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            const userConversation = {
              userId: 'dljfjkdsf',
              conversationId: 'dkfjhdsjkhf',
              seen: true,
              dateJoined: new Date(),
            };
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(
              userConversation,
            );
            const conversation = {
              id: 'dsjfdsf',
              name: 'dfjdskf',
              isGroup: true,
              photo: null,
            };
            prismaMock.conversation.findUnique.mockResolvedValueOnce(
              conversation,
            );
            prismaMock.user.findMany.mockResolvedValueOnce([]);
            prismaMock.userConversations.findMany.mockResolvedValueOnce([
              userConversation,
            ]);
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123')
              .send({
                users: ['sdkhfcjshdbc'],
              });
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Not all users are found');
          });
          test('user already exist should repond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            const userConversation = {
              userId: 'eac0ece1',
              conversationId: 'dkfjhdsjkhf',
              seen: true,
              dateJoined: new Date(),
            };
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(
              userConversation,
            );
            const conversation = {
              id: 'dsjfdsf',
              name: 'dfjdskf',
              isGroup: true,
              photo: null,
            };
            prismaMock.conversation.findUnique.mockResolvedValueOnce(
              conversation,
            );
            prismaMock.user.findMany.mockResolvedValueOnce([user]);
            const userConversation2 = {
              userId: 'eac0ece1',
            };
            prismaMock.userConversations.findMany.mockResolvedValueOnce([
              userConversation2 as any,
            ]);
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123')
              .send({
                users: ['sdkhfcjshdbc'],
              });
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('User already exists');
          });
          test('user already exist should repond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            const userConversation = {
              userId: 'eac0ece1',
              conversationId: 'dkfjhdsjkhf',
              seen: true,
              dateJoined: new Date(),
            };
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(
              userConversation,
            );
            const conversation = {
              id: 'dsjfdsf',
              name: 'dfjdskf',
              isGroup: true,
              photo: null,
            };
            prismaMock.conversation.findUnique.mockResolvedValueOnce(
              conversation,
            );
            prismaMock.user.findMany.mockResolvedValueOnce([user]);
            const userConversation2 = {
              userId: 'gfhgfdh',
            };
            prismaMock.userConversations.findMany.mockResolvedValueOnce([
              userConversation2 as any,
            ]);
            prismaMock.userConversations.createMany.mockImplementation(
              jest.fn(),
            );
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123')
              .send({
                users: ['sdkhfcjshdbc'],
              });
            expect(response.status).toBe(201);
            expect(response.body.message).toEqual('Users added successfully');
          });
        });
        describe('user isnot in conversation', () => {
          test('should repond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              id: 'eac0ece1',
              name: 'Zahran',
              birthDate: new Date(),
              location: null,
              url: null,
              description: null,
              protected: false,
              verified: false,
              followersCount: 0,
              followingCount: 0,
              createdAt: new Date(),
              deletedAt: null,
              profileBannerUrl: null,
              profileImageUrl: null,
              email: 'ahmed@gmail.com',
              userName: 'ahmedzahran12364',
              password:
                '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
              passwordChangedAt: null,
              passwordResetToken: null,
              passwordResetExpires: null,
              google_id: null,
            };
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            prismaMock.userConversations.findFirst.mockResolvedValueOnce(null);
            const response = await Request(app)
              .post('/api/v1/conversation/135435/user')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual(
              'User is not in conversation',
            );
          });
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .post('/api/v1/conversation/123456/user')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(404);
          expect(response.body.message).toStrictEqual('User not found');
        });
      });
    });
    describe('auth_key is invalid', () => {
      test('should respond with status 409 token expired', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({
          id: 'eac0ece1',
          iat: 1699498302,
          exp: 0,
        });

        const response = await Request(app)
          .post('/api/v1/conversation/123456/user')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .post('/api/v1/conversation/123456/user')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual(
          'Invalid access credentials',
        );
      });
    });
  });
  describe('auth_key not found in header', () => {
    test('should respond with status 401', async () => {
      const response = await Request(app).post(
        '/api/v1/conversation/123456/user',
      );
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});
