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