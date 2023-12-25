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
        test('No query in request should respond by 400', async () => {
          const user = {
            notificationCount: 0,
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
        test('No conversation by that Id should respond by 400', async () => {
          const user = {
            notificationCount: 0,
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
        test('Users matched are returned should respond by 200', async () => {
          const user = {
            notificationCount: 0,
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
          test('Conversation not found should respond by 500', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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
          test('Conversation is not group should respond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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
          test('No users to add should respond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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
          test('Not all users are found should respond by 404', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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
          test('user already exist should respond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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
          test('user added should respond by 201', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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
          test('should respond by 401', async () => {
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            const user = {
              notificationCount: 0,
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

describe('searchForMembersForNewConversation Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('no query in the request should respond by 400', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
            .get('/api/v1/conversation/user')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(400);
          expect(response.body.issues[0].message).toEqual(
            'Conversation name is required',
          );
        });
        test('users list is returned should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const user2 = {
            notificationCount: 0,
            name: 'dsfdsf',
            userName: 'sdfdsf',
            profileImageUrl: 'dsffds',
            follower: [],
            followed: [],
            blocked: [],
            muted: [],
          };
          prismaMock.user.findMany.mockResolvedValueOnce([user2 as any]);
          const response = await Request(app)
            .get('/api/v1/conversation/user?q=dsjfhsk')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.users).toBeDefined();
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
            .get('/api/v1/conversation/user')
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
          .get('/api/v1/conversation/user')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .get('/api/v1/conversation/user')
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
      const response = await Request(app).get('/api/v1/conversation/user');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('createConversation Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('payload is incorrect should respond by 400', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(400);
          expect(response.body.issues[0].message).toEqual(
            'Users to be added are required',
          );
        });
        test('not all users found should respond by 401', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          prismaMock.user.findUnique.mockResolvedValueOnce(null);
          const response = await Request(app)
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123')
            .send({
              users: ['sdkhfcjshdbc'],
            });
          expect(response.status).toBe(401);
          expect(response.body.message).toStrictEqual(
            'not all users are found',
          );
        });
        test('cannot converse with yourself should respond by 402', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          prismaMock.user.findUnique.mockResolvedValueOnce(user);
          const response = await Request(app)
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123')
            .send({
              users: ['sdkhfcjshdbc'],
            });
          expect(response.status).toBe(402);
          expect(response.body.message).toStrictEqual(
            "can't create conversation with yourself",
          );
        });
        test('no users provided should respond by 403', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123')
            .send({
              users: [],
            });
          expect(response.status).toBe(403);
          expect(response.body.message).toStrictEqual('no users provided');
        });
        test('DM is found and returned should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const user2 = {
            notificationCount: 0,
            id: 'sdfdsgfsgf',
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
          prismaMock.user.findUnique.mockResolvedValueOnce(user2);
          prismaMock.user.findFirst.mockResolvedValueOnce(user2);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          const conversation = {
            id: 'sdfg',
            name: 'dsfdsgsd',
            isGroup: false,
            photo: null,
          };
          prismaMock.conversation.findFirst.mockResolvedValue(conversation);

          const response = await Request(app)
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123')
            .send({
              users: ['sdkhfcjshdbc'],
            });
          expect(response.status).toBe(200);
          expect(response.body.isGroup).toStrictEqual(false);
        });
        test('DM is not found and created should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const user2 = {
            notificationCount: 0,
            id: 'sdfdsgfsgf',
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
          prismaMock.user.findUnique.mockResolvedValueOnce(user2);
          prismaMock.user.findFirst.mockResolvedValueOnce(user2);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          const conversation = {
            id: 'sdfg',
            name: 'dsfdsgsd',
            isGroup: false,
            photo: null,
          };
          prismaMock.conversation.findFirst.mockResolvedValue(null);
          prismaMock.conversation.create.mockResolvedValueOnce(conversation);
          const message = {
            id: 'string',
            text: 'string',
            date: new Date(),
            userId: 'string',
            conversationId: 'string',
            isMessage: false,
            replyToMessageId: null,
            deletedAt: null,
          };
          prismaMock.message.create.mockResolvedValue(message);

          const response = await Request(app)
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123')
            .send({
              users: ['sdkhfcjshdbc'],
            });
          expect(response.status).toBe(200);
          expect(response.body.isGroup).toStrictEqual(false);
        });
        test('Group created should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const user2 = {
            notificationCount: 0,
            id: 'sdfdsgfsgf',
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
          prismaMock.user.findUnique.mockResolvedValueOnce(user2);
          prismaMock.user.findUnique.mockResolvedValueOnce(user2);
          prismaMock.user.findFirst.mockResolvedValueOnce(user2);
          prismaMock.user.findFirst.mockResolvedValueOnce(user2);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          const conversation = {
            id: 'sdfg',
            name: 'dsfdsgsd',
            isGroup: true,
            photo: null,
          };
          prismaMock.conversation.create.mockResolvedValueOnce(conversation);
          const message = {
            id: 'string',
            text: 'string',
            date: new Date(),
            userId: 'string',
            conversationId: 'string',
            isMessage: false,
            replyToMessageId: null,
            deletedAt: null,
          };
          prismaMock.message.create.mockResolvedValueOnce(message);
          const userConversations = {
            userId: 'string',
            conversationId: 'string',
            seen: false,
            dateJoined: new Date(),
          };
          prismaMock.userConversations.create.mockResolvedValue(
            userConversations,
          );

          const response = await Request(app)
            .post('/api/v1/conversation/')
            .set('authorization', 'Bearer abc123')
            .send({
              users: ['sdkhfcjshdbc', 'kdkjfhkdsjhfkj'],
            });
          expect(response.status).toBe(200);
          expect(response.body.isGroup).toStrictEqual(true);
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
            .post('/api/v1/conversation/')
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
          .post('/api/v1/conversation/')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .post('/api/v1/conversation/')
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
      const response = await Request(app).post('/api/v1/conversation/');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('getConversation Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('return conversations name defined should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const message = {
            id: 'ffdlgf',
            text: 'gsfdkgj',
            date: new Date(),
            isMessage: true,
            sender: {
              id: 'sdafdsf',
              name: 'sdafdsaf',
              userName: 'sadfdsaf',
              profileImageUrl: null,
              description: null,
              followersCount: 0,
              followingCount: 0,
            },
            Conversation: {
              UserConversations: [
                {
                  User: {
                    id: 'asfdsaf',
                    name: 'dsfads',
                    userName: 'sdafadsf',
                    profileImageUrl: null,
                    description: null,
                    followersCount: 0,
                    followingCount: 0,
                  },
                  dateJoined: new Date(),
                },
              ],
              id: 'sdfasdf',
              photo: null,
              name: 'dsafdasfas',
              isGroup: true,
            },
          };
          prismaMock.message.findMany.mockResolvedValueOnce([message as any]);

          const media = {
            entity: {
              Mention: null,
              Hashtag: null,
              Url: null,
              Media: { type: 'image', url: 'sajdhsak' },
            },
          };
          const mention = {
            entity: {
              Mention: {
                mentionedUser: {
                  userName: 'sdfdasf',
                },
              },
              Hashtag: null,
              Url: null,
              Media: null,
            },
          };
          const hashtag = {
            entity: {
              Hashtag: {
                text: 'sdfsadf',
                count: 'sdfaf',
              },
              Url: null,
              Media: null,
            },
          };
          const url = {
            entity: {
              Hashtag: null,
              Url: {
                text: 'dsafsaf',
              },
              Media: null,
            },
          };
          prismaMock.messageEntity.findMany.mockResolvedValueOnce([
            mention as any,
            hashtag as any,
            url as any,
            media as any,
          ]);

          prismaMock.userConversations.findUnique.mockResolvedValueOnce(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.mute.findUnique.mockResolvedValue(null);

          const response = await Request(app)
            .get('/api/v1/conversation')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
        });
        test('return conversations name undefined should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const message = {
            id: 'ffdlgf',
            text: 'gsfdkgj',
            date: new Date(),
            isMessage: true,
            sender: {
              id: 'sdafdsf',
              name: 'sdafdsaf',
              userName: 'sadfdsaf',
              profileImageUrl: null,
              description: null,
              followersCount: 0,
              followingCount: 0,
            },
            Conversation: {
              UserConversations: [
                {
                  User: {
                    id: 'eac0ece1',
                    name: null,
                    userName: 'ahmedzahran12364',
                    profileImageUrl: null,
                    description: null,
                    followersCount: 0,
                    followingCount: 0,
                  },
                  dateJoined: new Date(),
                },
                {
                  User: {
                    id: 'asfdsaf',
                    name: null,
                    userName: 'sdafadsf',
                    profileImageUrl: null,
                    description: null,
                    followersCount: 0,
                    followingCount: 0,
                  },
                  dateJoined: new Date(),
                },
              ],
              id: 'sdfasdf',
              photo: null,
              name: null,
              isGroup: true,
            },
          };

          prismaMock.message.findMany.mockResolvedValueOnce([message as any]);

          const media = {
            entity: {
              Mention: null,
              Hashtag: null,
              Url: null,
              Media: { type: 'image', url: 'sajdhsak' },
            },
          };
          const mention = {
            entity: {
              Mention: {
                mentionedUser: {
                  userName: 'sdfdasf',
                },
              },
              Hashtag: null,
              Url: null,
              Media: null,
            },
          };
          const hashtag = {
            entity: {
              Hashtag: {
                text: 'sdfsadf',
                count: 'sdfaf',
              },
              Url: null,
              Media: null,
            },
          };
          const url = {
            entity: {
              Hashtag: null,
              Url: {
                text: 'dsafsaf',
              },
              Media: null,
            },
          };
          prismaMock.messageEntity.findMany.mockResolvedValueOnce([
            mention as any,
            hashtag as any,
            url as any,
            media as any,
          ]);

          prismaMock.userConversations.findUnique.mockResolvedValueOnce(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.mute.findUnique.mockResolvedValue(null);

          const response = await Request(app)
            .get('/api/v1/conversation')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
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
            .get('/api/v1/conversation/')
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
          .get('/api/v1/conversation/')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .get('/api/v1/conversation/')
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
      const response = await Request(app).get('/api/v1/conversation/');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('deleteConversation Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('conversation not found should respond by 401', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          prismaMock.conversation.findUnique.mockResolvedValueOnce(null);
          const response = await Request(app)
            .delete('/api/v1/conversation/123456')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(401);
          expect(response.body.message).toStrictEqual('conversation not found');
        });
        test('conversation deleted succesfully should respond by 200', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const conversation = {
            id: 'dsjfdsf',
            name: 'dfjdskf',
            isGroup: true,
            photo: null,
          };
          prismaMock.conversation.findUnique.mockResolvedValueOnce(
            conversation,
          );
          const conversation2 = {
            userId: 'string',
            conversationId: 'string',
            seen: true,
            dateJoined: new Date(),
          };
          prismaMock.userConversations.delete.mockResolvedValueOnce(
            conversation2,
          );
          const message = {
            id: 'fgdfg',
            text: 'dfgfdg',
            date: new Date(),
            userId: 'dsfgdsfg',
            conversationId: 'dsfgdfsg',
            isMessage: true,
            replyToMessageId: null,
            deletedAt: null,
          };
          prismaMock.message.create.mockResolvedValueOnce(message);

          const response = await Request(app)
            .delete('/api/v1/conversation/123456')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.operationSuccess).toStrictEqual(true);
        });
        test('conversation deletion failed should respond by 404', async () => {
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          const user = {
            notificationCount: 0,
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
          const conversation = {
            id: 'dsjfdsf',
            name: 'dfjdskf',
            isGroup: true,
            photo: null,
          };
          prismaMock.conversation.findUnique.mockResolvedValueOnce(
            conversation,
          );
          prismaMock.userConversations.delete.mockResolvedValueOnce(
            null as any,
          );
          const message = {
            id: 'fgdfg',
            text: 'dfgfdg',
            date: new Date(),
            userId: 'dsfgdsfg',
            conversationId: 'dsfgdfsg',
            isMessage: true,
            replyToMessageId: null,
            deletedAt: null,
          };
          prismaMock.message.create.mockResolvedValueOnce(message);

          const response = await Request(app)
            .delete('/api/v1/conversation/123456')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(404);
          expect(response.body.operationSuccess).toStrictEqual(false);
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
            .delete('/api/v1/conversation/123456')
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
          .delete('/api/v1/conversation/123456')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .delete('/api/v1/conversation/123456')
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
      const response = await Request(app).delete('/api/v1/conversation/123456');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});
