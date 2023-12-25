import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('GET /user', () => {
  test('this should send request with header containing token and return a media tweets of a user and 200 status code', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'jhondoe12364',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    let tweet1 = {
      createdAt: new Date('2022-03-25'),
      id: '123',
      text: 'dsvsadv',
      author: user,
      source: '123442',
      coordinates: '12341234',
      replyToTweetId: null,
      replyCount: 0,
      retweetedId: null,
      retweetCount: 0,
      qouteTweetedId: null,
      qouteCount: 0,
      likesCount: 4,
      sensitive: false,
      readCount: 0,
      userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      deletedAt: null,
      entities: {
        hashtags: [],
        media: [],
        mentions: [],
        urls: [],
      },
    };
    const tweets = [tweet1];

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);

    prismaMock.tweet.findMany.mockResolvedValue(tweets);
    prismaMock.tweetEntity.findUnique.mockResolvedValue({
      tweetId: '123',
      entityId: '234234',
    });
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

    const res = await Request(app)
      .get('/api/v1/tweets/user/123456/media')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
  test('this should send request with header containing token and non exisiting user and return 404 status code', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = null;
    let tweet1 = {
      createdAt: new Date('2022-03-25'),
      id: '123',
      text: 'dsvsadv',
      author: user,
      source: '123442',
      coordinates: '12341234',
      replyToTweetId: null,
      replyCount: 0,
      retweetedId: null,
      retweetCount: 0,
      qouteTweetedId: null,
      qouteCount: 0,
      likesCount: 4,
      sensitive: false,
      userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      deletedAt: null,
      readCount: 0,
      entities: {
        hashtags: [],
        media: [],
        mentions: [],
        urls: [],
      },
    };
    const tweets = [tweet1];

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);

    prismaMock.tweet.findMany.mockResolvedValue(tweets);
    prismaMock.tweetEntity.findUnique.mockResolvedValue({
      tweetId: '123',
      entityId: '234234',
    });
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

    const res = await Request(app)
      .get('/api/v1/tweets/user/123456/media')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});

// describe('get likes of a Tweet Function', () => {
//   describe('auth_key in header', () => {
//     describe('auth_key is valid', () => {
//       describe('user Found', () => {
//         describe('tweet exists', () => {
//           test('should respond with status 200', async () => {
//             const user = {
// notificationCount:0,
//               id: 'eac0ece1',
//               name: 'Zahran',
//               birthDate: new Date(),
//               location: null,
//               url: null,
//               description: null,
//               protected: false,
//               verified: false,
//               followersCount: 0,
//               followingCount: 0,
//               createdAt: new Date(),
//               deletedAt: null,
//               profileBannerUrl: null,
//               profileImageUrl: null,
//               email: 'ahmed@gmail.com',
//               userName: 'ahmedzahran12364',
//               password:
//                 '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
//               passwordChangedAt: null,
//               passwordResetToken: null,
//               passwordResetExpires: null,
//               google_id: null,
//             };
//             const tweet = {
//               createdAt: new Date(),
//               id: 'djfk',
//               text: 'dsgf',
//               source: 'dsdg',
//               coordinates: 'dsgds',
//               author: 'gsd',
//               userId: 'dsgdsg',
//               replyToTweetId: null,
//               replyCount: 0,
//               retweetedId: null,
//               retweetCount: 0,
//               qouteTweetedId: null,
//               qouteCount: 0,
//               likesCount: 0,
//               readCount:0,
//               sensitive: false,
//               deletedAt: new Date(),
//             };
//             const like = [
//               {
//                 userId: 'fjdh',
//                 tweetId: 'jdjhfj',
//               },
//             ];
//             jest.mock('bcrypt');
//             bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
//             jest.mock('jsonwebtoken');
//             jwt.sign = jest.fn().mockResolvedValue('generated_token');
//             jwt.verify = jest.fn().mockResolvedValue({
//               id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
//               iat: 1701267900,
//               exp: 1709043900,
//             });
//             prismaMock.user.findFirst.mockResolvedValueOnce(user);
//             prismaMock.tweet.findUnique.mockResolvedValueOnce(tweet);
//             prismaMock.like.findMany.mockResolvedValueOnce(like);

//             const response = await Request(app)
//               .get('/api/v1/tweets/123456/like')
//               .set('authorization', 'Bearer abc123');
//             expect(response.status).toBe(200);
//             expect(response.body.status).toStrictEqual('success');
//           });
//         });
//         describe('tweet doesnot exists', () => {
//           test('should respond with status 404', async () => {
//             const user = {
// notificationCount: 0,
//               id: 'eac0ece1',
//               name: 'Zahran',
//               birthDate: new Date(),
//               location: null,
//               url: null,
//               description: null,
//               protected: false,
//               verified: false,
//               followersCount: 0,
//               followingCount: 0,
//               createdAt: new Date(),
//               deletedAt: null,
//               profileBannerUrl: null,
//               profileImageUrl: null,
//               email: 'ahmed@gmail.com',
//               userName: 'ahmedzahran12364',
//               password:
//                 '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
//               passwordChangedAt: null,
//               passwordResetToken: null,
//               passwordResetExpires: null,
//               google_id: null,
//             };
//             jest.mock('bcrypt');
//             bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
//             jest.mock('jsonwebtoken');
//             jwt.sign = jest.fn().mockResolvedValue('generated_token');
//             jwt.verify = jest.fn().mockResolvedValue({
//               id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
//               iat: 1701267900,
//               exp: 1709043900,
//             });
//             prismaMock.user.findFirst.mockResolvedValueOnce(user);
//             prismaMock.tweet.findUnique.mockResolvedValueOnce(null);

//             const response = await Request(app)
//               .get('/api/v1/tweets/123456/like')
//               .set('authorization', 'Bearer abc123');
//             expect(response.status).toBe(404);
//             expect(response.body.message).toStrictEqual('Tweet is not Found');
//           });
//         });
//       });
//       describe('user not Found', () => {
//         test('should respond with status 404', async () => {
//           jest.mock('bcrypt');
//           bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
//           jest.mock('jsonwebtoken');
//           jwt.sign = jest.fn().mockResolvedValue('generated_token');
//           jwt.verify = jest.fn().mockResolvedValue({
//             id: 'eac0ece1',
//             iat: 1699498302,
//             exp: 1707274302,
//           });
//           prismaMock.user.findFirst.mockResolvedValue(null);
//           const response = await Request(app)
//             .get('/api/v1/tweets/123456/like')
//             .set('authorization', 'Bearer abc123');
//           expect(response.status).toBe(404);
//           expect(response.body.message).toStrictEqual('User not found');
//         });
//       });
//     });
//     describe('auth_key is invalid', () => {
//       test('should respond with status 409 token expired', async () => {
//         jwt.verify = jest.fn().mockResolvedValueOnce({
//           id: 'eac0ece1',
//           iat: 1699498302,
//           exp: 0,
//         });

//         const response = await Request(app)
//           .get('/api/v1/tweets/123456/like')
//           .set('authorization', 'Bearer abc123');

//         expect(response.status).toBe(409);
//         expect(response.body.message).toStrictEqual('Token Expired');
//       });
//       test('should respond with status 409 token invalid', async () => {
//         jwt.verify = jest.fn().mockResolvedValueOnce({});

//         const response = await Request(app)
//           .get('/api/v1/tweets/123456/like')
//           .set('authorization', 'Bearer abc123');

//         expect(response.status).toBe(409);
//         expect(response.body.message).toStrictEqual(
//           'Invalid access credentials',
//         );
//       });
//     });
//   });
//   describe('auth_key not found in header', () => {
//     test('should respond with status 401', async () => {
//       const response = await Request(app).get('/api/v1/tweets/123456/like');
//       expect(response.status).toBe(401);
//       expect(response.body.message).toStrictEqual('Unauthorized access');
//     });
//   });
// });

describe('GET /tweet/:id', () => {
  describe('Replies', () => {
    test('Should return tweet not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

      const res = await Request(app)
        .get('/api/v1/tweets/123/replies')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Tweet not found');
    });

    test('Should mock tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef/replies')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.replies).toHaveLength(0);
    });

    test('Should mock tweet reply', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const reply = {
        createdAt: new Date(),
        id: '451f773f-f284-4522-8e55-a17b6ddb63ef',
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
        author: user,
      };
      prismaMock.tweet.findMany.mockResolvedValue([reply]);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef/replies')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.replies).toHaveLength(1);
    });
  });
  describe('Retweets', () => {
    test('Should return tweet not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

      const res = await Request(app)
        .get('/api/v1/tweets/123/retweets')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
    });

    test('Should mock tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef/retweets')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.retweeters).toHaveLength(0);
    });

    test('Should mock tweet retweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const retweet = {
        createdAt: new Date(),
        id: '451f773f-f284-4522-8e55-a17b6ddb63ef',
        text: null,
        userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        readCount: 1,
        replyCount: 1,
        retweetCount: 1,
        qouteCount: 0,
        likesCount: 0,
        sensitive: false,
        source: null,
        coordinates: null,
        replyToTweetId: null,
        retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        qouteTweetedId: null,
        deletedAt: null,
        author: user,
      };
      prismaMock.tweet.findMany.mockResolvedValue([retweet]);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef/retweets')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.retweeters).toHaveLength(1);
    });
  });

  describe('Get Tweet', () => {
    test('Should return tweet not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });

      const res = await Request(app)
        .get('/api/v1/tweets/123')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
    });

    test('Should mock tweet deleted', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
        deletedAt: new Date(),
        author: user,
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(410);
      expect(res.body.message).toBe('Tweet was deleted');
    });

    test('Should mock user deleted', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
        birthDate: new Date(),
        location: null,
        url: null,
        description: null,
        protected: false,
        verified: false,
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date(),
        deletedAt: new Date(),
        profileBannerUrl: null,
        profileImageUrl: null,
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
        author: user,
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('user account was deleted');
    });

    test('Should mock normal tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.findFirst.mockResolvedValue(user);

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
        author: user,
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
    });
  });

  describe('Delete Tweet', () => {
    test('Should mock normal tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.findFirst.mockResolvedValue(user);

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
        author: user,
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);
      prismaMock.tweet.update.mockResolvedValue(tweet);

      const res = await Request(app)
        .delete('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(204);
    });
  });

  describe('get tweet likers', () => {
    test('Should return tweet not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });

      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

      const res = await Request(app)
        .get('/api/v1/tweets/123/retweets')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
    });

    test('Should mock tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef/like')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.ret).toHaveLength(0);
    });

    test('Should mock tweet like', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'jhondoe12364',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);

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
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweet);

      const likeObject = {
        userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        tweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        liker: user,
        liked: tweet,
      };

      prismaMock.like.findMany.mockResolvedValue([likeObject]);

      const res = await Request(app)
        .get('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63ef/like')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.ret).toHaveLength(1);
    });
  });

  describe('get user replies', () => {
    test('Should return user not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed/replies')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
    });

    test('Should mock tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed/replies')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(0);
    });

    test('Should mock tweets', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

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
        author: user,
      };

      const tweet2 = {
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
        author: user,
      };

      prismaMock.tweet.findMany.mockResolvedValue([tweet, tweet2]);

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed/replies')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(1);
    });
  });

  describe('get user tweets', () => {
    test('Should return user not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
    });

    test('Should mock tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(0);
    });

    test('Should mock tweets', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

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
        author: user,
      };

      prismaMock.tweet.findMany.mockResolvedValue([tweet]);

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(1);
    });
  });

  describe('get user liked tweets', () => {
    test('Should return user not found', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed/likes')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(404);
    });

    test('Should not mock tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed/like')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);

      expect(res.body.tweets).toHaveLength(0);
    });

    test('Should mock tweets', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

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
        author: user,
      };

      prismaMock.tweet.findMany.mockResolvedValue([tweet]);

      const like1 = {
        userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        tweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        liker: user,
        liked: tweet,
      };
      prismaMock.like.findMany.mockResolvedValue([like1]);

      const res = await Request(app)
        .get('/api/v1/tweets/user/ahmed/like')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(1);
    });
  });

  describe('post tweet', () => {
    test('Can not retweet and reply together', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      // const tweet = {
      //   createdAt: new Date(),
      //   id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
      //   text: "Hello",
      //   userId: "251f773f-f284-4522-8e55-a17b6ddb63ef",
      //   readCount: 1,
      //   replyCount: 1,
      //   retweetCount: 0,
      //   qouteCount: 0,
      //   likesCount: 0,
      //   sensitive: false,
      //   source:null,
      //   coordinates:null,
      //   replyToTweetId:null,
      //   retweetedId:null,
      //   qouteTweetedId:null,
      //   deletedAt: null,
      //   author: user
      // };

      // prismaMock.tweet.findMany.mockResolvedValue([tweet]);

      // const like1 = {
      //   userId: "251f773f-f284-4522-8e55-a17b6ddb63ef",
      //   tweetId: "351f773f-f284-4522-8e55-a17b6ddb63ef",
      //   liker: user,
      //   liked: tweet
      // }
      // prismaMock.like.findMany.mockResolvedValue([like1]);

      const res = await Request(app)
        .post('/api/v1/tweets')
        .set('authorization', 'Bearer abc123')
        .send({
          text: 'hello',
          source: 'IPhone',
          replyToTweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
          retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
          sensitive: '',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Can not retweet and reply together');
    });
  });

  test('Invalid replyToTweetId', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    // const tweet = {
    //   createdAt: new Date(),
    //   id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
    //   text: "Hello",
    //   userId: "251f773f-f284-4522-8e55-a17b6ddb63ef",
    //   readCount: 1,
    //   replyCount: 1,
    //   retweetCount: 0,
    //   qouteCount: 0,
    //   likesCount: 0,
    //   sensitive: false,
    //   source:null,
    //   coordinates:null,
    //   replyToTweetId:null,
    //   retweetedId:null,
    //   qouteTweetedId:null,
    //   deletedAt: null,
    //   author: user
    // };

    // prismaMock.tweet.findUnique.mockResolvedValue(tweet);
    prismaMock.tweet.findUnique.mockResolvedValue(null);
    const res = await Request(app)
      .post('/api/v1/tweets')
      .set('authorization', 'Bearer abc123')
      .send({
        text: 'hello',
        source: 'IPhone',
        replyToTweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        // retweetedId:"351f773f-f284-4522-8e55-a17b6ddb63ef",
        sensitive: '',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid replyToTweetId');
  });

  test('Invalid retweetedId', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    prismaMock.tweet.findUnique.mockResolvedValue(null);

    // const tweet = {
    //   createdAt: new Date(),
    //   id: '351f773f-f284-4522-8e55-a17b6ddb63ef',
    //   text: "Hello",
    //   userId: "251f773f-f284-4522-8e55-a17b6ddb63ef",
    //   readCount: 1,
    //   replyCount: 1,
    //   retweetCount: 0,
    //   qouteCount: 0,
    //   likesCount: 0,
    //   sensitive: false,
    //   source:null,
    //   coordinates:null,
    //   replyToTweetId:null,
    //   retweetedId:null,
    //   qouteTweetedId:null,
    //   deletedAt: null,
    //   author: user
    // };

    // prismaMock.tweet.findUnique.mockResolvedValue(tweet);

    const res = await Request(app)
      .post('/api/v1/tweets')
      .set('authorization', 'Bearer abc123')
      .send({
        text: 'hello',
        source: 'IPhone',
        // replyToTweetId:"351f773f-f284-4522-8e55-a17b6ddb63ef",
        retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        sensitive: '',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid retweetId');
  });

  test('Correct retweetedId', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

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
      author: user,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(tweet);

    const tweetCreated = {
      createdAt: new Date(),
      id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
      author: user,
      retweetedTweet: tweet,
    };

    prismaMock.tweet.create.mockResolvedValue(tweetCreated);

    const res = await Request(app)
      .post('/api/v1/tweets')
      .set('authorization', 'Bearer abc123')
      .send({
        text: 'hello',
        source: 'IPhone',
        // replyToTweetId:"351f773f-f284-4522-8e55-a17b6ddb63ef",
        retweetedId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        sensitive: '',
      });

    expect(res.status).toBe(201);
  });

  test('Correct replyToTweetId', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const followObject = {
      folowererId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      followedId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
    };
    prismaMock.follow.findMany.mockResolvedValue([followObject]);

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
      author: user,
    };

    prismaMock.tweet.findUnique.mockResolvedValue(tweet);

    const tweetCreated = {
      createdAt: new Date(),
      id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
      author: user,
      replyToTweet: tweet,
    };

    prismaMock.tweet.create.mockResolvedValue(tweetCreated);

    const notificationResponse = {
      id: '251f773f-f284-4522-8e55-a17b6ddb63aa',
      createdAt: new Date(),
      senderId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      objectId: '351f773f-f284-4522-8e55-a17b6ddb63eg',
      type: 'post',
      deleted: false,
      seen: false,
    };
    prismaMock.notification.create.mockResolvedValue(notificationResponse);

    const res = await Request(app)
      .post('/api/v1/tweets')
      .set('authorization', 'Bearer abc123')
      .send({
        text: 'hello',
        source: 'IPhone',
        replyToTweetId: '351f773f-f284-4522-8e55-a17b6ddb63ef',
        // retweetedId:"351f773f-f284-4522-8e55-a17b6ddb63ef",
        sensitive: '',
      });

    expect(res.status).toBe(201);
  });

  describe('search tweets', () => {
    test('search text', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const tweetCreated = {
        createdAt: new Date(),
        id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
        author: user,
      };

      prismaMock.tweet.findMany.mockResolvedValue([tweetCreated]);

      const res = await Request(app)
        .get('/api/v1/tweets?q=o')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(1);
    });

    test('search hashtags', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const tweetCreated = {
        createdAt: new Date(),
        id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
        author: user,
      };

      prismaMock.tweet.findMany.mockResolvedValue([tweetCreated]);

      const res = await Request(app)
        .get('/api/v1/tweets?hashtag=o')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(200);
      expect(res.body.tweets).toHaveLength(1);
    });
  });

  test('search hashtags 2', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const tweetCreated = {
      createdAt: new Date(),
      id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
      author: user,
    };

    prismaMock.tweet.findMany.mockResolvedValue([tweetCreated]);

    const res = await Request(app)
      .get('/api/v1/tweets/hashtags?q=o')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });

  test('search timeline', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const tweetCreated = {
      createdAt: new Date(),
      id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
      author: user,
    };

    prismaMock.tweet.findMany.mockResolvedValue([tweetCreated]);

    const res = await Request(app)
      .get('/api/v1/tweets')
      .set('authorization', 'Bearer abc123');

    expect(res.status).toBe(200);
    expect(res.body.tweets).toHaveLength(1);
  });

  test('search for you timeline', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const tweetCreated = {
      createdAt: new Date(),
      id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
      author: user,
    };

    prismaMock.tweet.findMany.mockResolvedValue([tweetCreated]);
    prismaMock.tweet.findUnique.mockResolvedValue(tweetCreated);

    const res = await Request(app)
      .get('/api/v1/timeline')
      .set('authorization', 'Bearer abc123');

    expect(res.status).toBe(200);
    expect(res.body.tweets).toHaveLength(1);
  });

  describe('like/unlike tweets', () => {
    test('like enot existing tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await Request(app)
        .post('/api/v1/tweets/123/like')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(400);
    });

    test('umlike enot existing tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await Request(app)
        .delete('/api/v1/tweets/123/like')
        .set('authorization', 'Bearer abc123');

      expect(res.status).toBe(400);
    });

    test('like existing tweet', async () => {
      jest.mock('bcrypt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jest.mock('jsonwebtoken');
      jwt.sign = jest.fn().mockResolvedValue('generated_token');
      jwt.verify = jest.fn().mockResolvedValue({
        id: 'eac0ece1',
        iat: 1699498302,
        exp: 1707274302,
      });
      const user = {
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'jhon doe',
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
        email: 'jhon@qwitter.com',
        userName: 'ahmed',
        password:
          '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
        passwordChangedAt: null,
        passwordResetToken: 'registered_fake_token',
        passwordResetExpires: null,
        google_id: '',
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const tweetCreated = {
        createdAt: new Date(),
        id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
        author: user,
      };
      prismaMock.tweet.findFirst.mockResolvedValue(tweetCreated);
      prismaMock.tweet.findUnique.mockResolvedValue(tweetCreated);

      const notificationResponse = {
        id: '251f773f-f284-4522-8e55-a17b6ddb63aa',
        createdAt: new Date(),
        senderId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        objectId: '351f773f-f284-4522-8e55-a17b6ddb63eg',
        type: 'like',
        deleted: false,
        seen: false,
      };
      prismaMock.notification.create.mockResolvedValue(notificationResponse);

      const res = await Request(app)
        .post('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63eg/like')
        .set('authorization', 'Bearer abc123');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  test('unlike existing tweet', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'jhon doe',
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
      email: 'jhon@qwitter.com',
      userName: 'ahmed',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const tweetCreated = {
      createdAt: new Date(),
      id: '351f773f-f284-4522-8e55-a17b6ddb63eg',
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
      author: user,
    };
    prismaMock.tweet.findFirst.mockResolvedValue(tweetCreated);
    prismaMock.tweet.findUnique.mockResolvedValue(tweetCreated);

    const notificationResponse = {
      id: '251f773f-f284-4522-8e55-a17b6ddb63aa',
      createdAt: new Date(),
      senderId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      objectId: '351f773f-f284-4522-8e55-a17b6ddb63eg',
      type: 'like',
      deleted: false,
      seen: false,
    };
    prismaMock.notification.create.mockResolvedValue(notificationResponse);

    const likeResponse = {
      userId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      tweetId: '351f773f-f284-4522-8e55-a17b6ddb63eg',
    };

    prismaMock.like.findUnique.mockResolvedValue(likeResponse);

    const res = await Request(app)
      .delete('/api/v1/tweets/351f773f-f284-4522-8e55-a17b6ddb63eg/like')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
