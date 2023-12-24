// import * as notificationController from '../controllers/notificationController';
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

jest.mock('bcrypt');
bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
jest.mock('jsonwebtoken');
jwt.sign = jest.fn().mockResolvedValue('generated_token');
jwt.verify = jest.fn().mockResolvedValue({
  id: 'eac0ece1',
  iat: 1699498302,
  exp: 1707274302,
});

// test get all notifications
describe('getNotification Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('reply should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: '5f5fd0e1-5644-4585-991a-3d21463a6864',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: '5f5fd0e1-5644-4585-991a-3d21463a6864',
                objectId: '78c6ec3a-5cbf-40a0-9397-9072473bda71',
                deleted: false,
                seen: false,
                createdAt: '2023-12-19T00:59:40.631Z',
                senderId: '840b3ffc-6258-498c-824d-14dab46633ac',
                type: 'reply',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            retweetedId: null,
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(1);
        });
        test('retweet should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: '4b7937ee-bb2c-4000-aaff-42d65dedce13',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: '4b7937ee-bb2c-4000-aaff-42d65dedce13',
                objectId: '954b8b47-0694-4b0b-bac3-5d831110b5c7',
                deleted: false,
                seen: false,
                createdAt: '2023-12-19T01:00:17.462Z',
                senderId: '840b3ffc-6258-498c-824d-14dab46633ac',
                type: 'retweet',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: null,
            retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(1);
        });
        test('login should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: '08b44192-e506-4f94-ad4a-a80256891013',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: '08b44192-e506-4f94-ad4a-a80256891013',
                objectId: null,
                deleted: false,
                seen: false,
                createdAt: '2023-12-22T00:16:54.390Z',
                senderId: '840b3ffc-6258-498c-824d-14dab46633ac',
                type: 'login',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(1);
        });
        test('follow should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: 'a6ccb6b9-428e-4eb7-afbd-cc3bf94a8577',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: 'a6ccb6b9-428e-4eb7-afbd-cc3bf94a8577',
                objectId: null,
                deleted: false,
                seen: false,
                createdAt: '2023-12-21T14:53:09.319Z',
                senderId: '2d36a06e-dbf3-47bf-a198-eadfda9ed75a',
                type: 'follow',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(1);
        });
        test('post should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: '08b44192-e506-4f94-ad4a-a80256891013',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: '08b44192-e506-4f94-ad4a-a80256891013',
                objectId: '83275aa1-f93e-4972-a368-7e8d99c4ac1f',
                deleted: false,
                seen: false,
                createdAt: '2023-12-22T00:16:54.390Z',
                senderId: '840b3ffc-6258-498c-824d-14dab46633ac',
                type: 'post',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: null,
            retweetedId: null,
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(1);
        });
        test('like should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: '08b44192-e506-4f94-ad4a-a80256891013',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: '08b44192-e506-4f94-ad4a-a80256891013',
                objectId: '83275aa1-f93e-4972-a368-7e8d99c4ac1f',
                deleted: false,
                seen: false,
                createdAt: '2023-12-22T00:16:54.390Z',
                senderId: '840b3ffc-6258-498c-824d-14dab46633ac',
                type: 'like',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: null,
            retweetedId: null,
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(1);
        });
        test('unknown type is skipped should respond with status 200', async () => {
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
          const Notifications = [
            {
              notificationId: '08b44192-e506-4f94-ad4a-a80256891013',
              recieverId: '840b3ffc-6258-498c-824d-14dab46633ac',
              Notification: {
                id: '08b44192-e506-4f94-ad4a-a80256891013',
                objectId: '83275aa1-f93e-4972-a368-7e8d99c4ac1f',
                deleted: false,
                seen: false,
                createdAt: '2023-12-22T00:16:54.390Z',
                senderId: '840b3ffc-6258-498c-824d-14dab46633ac',
                type: 'unknown',
              },
            },
          ];
          prismaMock.recieveNotification.findMany.mockResolvedValue(
            Notifications,
          );

          const author = {
            name: 'AOZ 2025',
            location: 'i am here',
            url: 'https://www.google.com',
            description: null,
            protected: false,
            verified: false,
            followersCount: 1,
            followingCount: 0,
            createdAt: new Date(),
            profileBannerUrl: null,
            profileImageUrl: null,
            email: 'ahmed@qwitter.com',
            userName: 'ahmedzahran715b86',
            birthDate: new Date(),
          };
          const tweet = {
            createdAt: new Date(),
            id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
            text: 'Hello',
            userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
            readCount: 1,
            replyCount: 1,
            retweetCount: 0,
            qouteCount: 0,
            likesCount: 0,
            sensitive: false,
            source: null,
            coordinates: null,
            replyToTweetId: null,
            retweetedId: null,
            qouteTweetedId: null,
            deletedAt: null,
            author: author,
          };
          prismaMock.tweet.findFirst.mockResolvedValue(tweet);
          prismaMock.tweetEntity.findMany.mockResolvedValue([
            {
              tweetId: '123',
              entityId: '234234',
            },
          ]);
          const entity = {
            id: '234234',
            type: 'media',
          };
          prismaMock.entity.findUnique.mockResolvedValue(entity);
          prismaMock.tweet.findUnique.mockResolvedValue(tweet);
          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.block.findUnique.mockResolvedValue(null);
          prismaMock.like.findFirst.mockResolvedValue(null);
          prismaMock.follow.findUnique.mockResolvedValue(null);
          prismaMock.user.findFirst.mockResolvedValue(user);

          const response = await Request(app)
            .get('/api/v1/notifications/')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.notifications).toHaveLength(0);
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          prismaMock.user.findFirst.mockResolvedValue(null);

          const response = await Request(app)
            .get('/api/v1/notifications/')
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
          .get('/api/v1/notifications/')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .get('/api/v1/notifications/')
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
      const response = await Request(app).get('/api/v1/notifications/');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});
