import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('GET /user/:username', () => {
  test('this should send request with header containing token with a non existing user and return 404 with User not found\n', async () => {
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
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);

    const res = await Request(app)
      .get('/api/v1/user/jhondoe')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(404);
    expect(res.body.message).toEqual('User not found');
  });
  test('this should send request and return 200\n', async () => {
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
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const res = await Request(app)
      .get('/api/v1/user/jhondoe')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
  test('this should send request with header containing token with a non existing user and return 404 with User not found\n', async () => {
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
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const res = await Request(app)
      .get('/api/v1/user/jhondoe')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });

  test('this should send request with header containing token and return non exisiting user error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({});
    prismaMock.user.findFirst.mockResolvedValue(null);
    const res = await Request(app).get('/api/v1/user/jhon');
    expect(res.status).toBe(404);
  });
  test('should send a  token and without id and return error ', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran12364',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: new Date(),
      google_id: '',
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const response = await Request(app)
      .get('/api/v1/user/jhon')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toEqual(409);
    expect(response.body.message).toStrictEqual('Invalid access credentials');
  });
  test('should send a expired token and return msg Invalid token and status 400 ', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran12364',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: new Date(),
      google_id: '',
    };
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '238423874',
      exp: 0,
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const response = await Request(app)
      .get('/api/v1/user/jhon')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toEqual(409);
    expect(response.body.message).toStrictEqual('Token Expired');
  });
});

describe('POST /follow/:username', () => {
  test('this should send follow request to the authinticatin user with header containing token and return a failure message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.follow.findFirst.mockResolvedValue(null);

    const res = await Request(app)
      .post('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Can't follow youself");
  });
  const notification = require('../utils/notifications');

  test('this should send follow request with header containing token and return a success message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    const targeUser = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a11b6ddb63ef',
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
      email: 'ghaith@qwitter.com',
      userName: 'ghaith',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };

    prismaMock.user.findFirst.mockResolvedValue(targeUser);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.follow.findFirst.mockResolvedValue(null);
    prismaMock.notification.create.mockResolvedValue({
      id: '23423',
      objectId: '213412',
      deleted: false,
      seen: false,
      createdAt: new Date(),
      senderId: 'dfd',
      type: 'follow',
    });
    prismaMock.recieveNotification.create.mockResolvedValue({
      recieverId: '12312432',
      notificationId: '34562345645',
    });
    jest.spyOn(notification, 'sendNotification').mockReturnValue(null);
    const res = await Request(app)
      .post('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User followed successfully');
  });
  test('this should send follow request to an already followed user with header containing token and return a failure message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    const targeUser = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a11b6ddb63ef',
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
      email: 'ghaith@qwitter.com',
      userName: 'ghaith',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };

    prismaMock.user.findFirst.mockResolvedValue(targeUser);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.follow.findUnique.mockResolvedValue({
      folowererId: 'fake_id',
      followedId: 'fake_id',
    });

    const res = await Request(app)
      .post('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User is already followed');
  });
  test('this should send follow request to an already followed user with header containing token and return a failure message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await Request(app)
      .post('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User to follow not found');
  });
});

describe('DELETE /follow/:username', () => {
  test('this should send delete follow request to the authinticatin user with header containing token and return a failure message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.follow.findUnique.mockResolvedValue({
      folowererId: 'fake_id',
      followedId: 'fake_id',
    });

    const res = await Request(app)
      .delete('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Can't unfollow youself");
  });

  test('this should send delete follow request with header containing token and return a success message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    const targeUser = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a11b6ddb63ef',
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
      email: 'ghaith@qwitter.com',
      userName: 'ghaith',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };

    prismaMock.user.findFirst.mockResolvedValue(targeUser);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.follow.findUnique.mockResolvedValue({
      folowererId: 'fake_id',
      followedId: 'fake_id',
    });
    const res = await Request(app)
      .delete('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User unfollowed successfully');
  });
  test('this should send delete follow request to an  unfollowed user with header containing token and return a failure message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    const targeUser = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a11b6ddb63ef',
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
      email: 'ghaith@qwitter.com',
      userName: 'ghaith',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
    };

    prismaMock.user.findFirst.mockResolvedValue(targeUser);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.follow.findUnique.mockResolvedValue(null);

    const res = await Request(app)
      .delete('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User is not followed');
  });
  test('this should send follow request to an already followed user with header containing token and return a failure message', async () => {
    jest.mock('bcrypt');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const user = {
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.follow.findUnique.mockResolvedValue({
      folowererId: 'fake_id',
      followedId: 'fake_id',
    });

    const res = await Request(app)
      .delete('/api/v1/user/follow/json')
      .set('Authorization', 'Bearer abc123');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User to unfollow not found');
  });
});

describe('userNameSuggestions Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        describe('userName isnot taken', () => {
          test('should respond with status 200', async () => {
            const user = {
              unSeenConversation: 0,
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
            jest.mock('bcrypt');
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            jest.mock('jsonwebtoken');
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
              iat: 1701267900,
              exp: 1709043900,
            });
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            prismaMock.user.findFirst.mockResolvedValueOnce(null);
            prismaMock.user.update.mockResolvedValueOnce(user);

            const response = await Request(app)
              .patch('/api/v1/user/username')
              .set('authorization', 'Bearer abc123')
              .send({ userName: 'ahmedzahran' });

            expect(response.status).toBe(200);
            expect(response.body.message).toStrictEqual(
              'userName was updated successfully',
            );
          });
        });
        describe('userName is taken', () => {
          test('should respond with status 409', async () => {
            const user = {
              unSeenConversation: 0,
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
            jest.mock('bcrypt');
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            jest.mock('jsonwebtoken');
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: 'eac0ece1',
              iat: 1699498302,
              exp: 1707274302,
            });
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            prismaMock.user.findFirst.mockResolvedValueOnce(user);

            const response = await Request(app)
              .patch('/api/v1/user/username')
              .set('authorization', 'Bearer abc123')
              .send({ userName: 'ahmedzahran' });

            expect(response.status).toBe(409);
            expect(response.body.message).toStrictEqual(
              'UserName already exists',
            );
          });
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .patch('/api/v1/user/username')
            .set('authorization', 'Bearer abc123')
            .send({ userName: 'ahmedzahran' });
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
          .patch('/api/v1/user/username')
          .set('authorization', 'Bearer abc123')
          .send({ userName: 'ahmedzahran' });

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .patch('/api/v1/user/username')
          .set('authorization', 'Bearer abc123')
          .send({ userName: 'ahmedzahran' });

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual(
          'Invalid access credentials',
        );
      });
    });
  });
  describe('auth_key not found in header', () => {
    test('should respond with status 401', async () => {
      const response = await Request(app)
        .patch('/api/v1/user/username')
        .send({ userName: 'ahmedzahran' });
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('POST /block/:username', () => {
  test('user not found', async () => {
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      iat: 1699498302,
      exp: 1707274302,
    });

    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findFirst.mockResolvedValue(user);

    const response = await Request(app)
      .post('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef'); // Assuming you use JWT for authentication

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual('user not found');

    prismaMock.user.findFirst.mockResolvedValue(null);
  });

  test('user already blocked', async () => {
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      iat: 1699498302,
      exp: 1707274302,
    });

    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773e-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Ibrahim',
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
      email: 'ahmed2@qwitter.com',
      userName: 'ahmedibrahim',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user2);
    prismaMock.user.findFirst.mockResolvedValue(user2);
    prismaMock.user.update.mockResolvedValue(user2);

    prismaMock.block.findUnique.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef',
    });
    prismaMock.block.findFirst.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef',
    });

    const response = await Request(app)
      .post('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef'); // Assuming you use JWT for authentication

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual('user already blocked');

    prismaMock.user.findFirst.mockResolvedValue(null);
  });

  test('should block a user', async () => {
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      iat: 1699498302,
      exp: 1707274302,
    });

    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);
    prismaMock.block.create.mockResolvedValue({
      blockerId: 'dfvndkfvnjf',
      blockedId: 'dfvdfvdfv',
    });

    const user2 = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773e-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Ibrahim',
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
      email: 'ahmed2@qwitter.com',
      userName: 'ahmedibrahim',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user2);
    prismaMock.user.findFirst.mockResolvedValue(user2);
    prismaMock.user.update.mockResolvedValue(user2);

    const response = await Request(app)
      .post('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef'); // Assuming you use JWT for authentication

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'success' });

    prismaMock.user.findFirst.mockResolvedValue(null);
  });
});

describe('DELETE /block/:username', () => {
  test('user not found', async () => {
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      iat: 1699498302,
      exp: 1707274302,
    });

    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findFirst.mockResolvedValue(user);

    const response = await Request(app)
      .delete('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef'); // Assuming you use JWT for authentication

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual('user not found');

    prismaMock.user.findFirst.mockResolvedValue(null);
  });

  test('user already unblocked', async () => {
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      iat: 1699498302,
      exp: 1707274302,
    });

    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773e-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Ibrahim',
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
      email: 'ahmed2@qwitter.com',
      userName: 'ahmedibrahim',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user2);
    prismaMock.user.findFirst.mockResolvedValue(user2);
    prismaMock.user.update.mockResolvedValue(user2);

    prismaMock.block.findUnique.mockResolvedValue(null);
    prismaMock.block.findFirst.mockResolvedValue(null);

    const response = await Request(app)
      .delete('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef');

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual('user not blocked');

    prismaMock.user.findFirst.mockResolvedValue(null);
  });

  test('should unblock a user', async () => {
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      iat: 1699498302,
      exp: 1707274302,
    });

    const user = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Zahran',
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
      email: 'ahmed@qwitter.com',
      userName: 'ahmedzahran',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '251f773e-f284-4522-8e55-a17b6ddb63ef',
      name: 'Ahmed Ibrahim',
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
      email: 'ahmed2@qwitter.com',
      userName: 'ahmedibrahim',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user2);
    prismaMock.user.findFirst.mockResolvedValue(user2);
    prismaMock.user.update.mockResolvedValue(user2);

    prismaMock.block.findUnique.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef',
    });
    prismaMock.block.findFirst.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef',
    });
    prismaMock.block.delete.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef',
    });

    const response = await Request(app)
      .delete('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'success' });

    prismaMock.user.findFirst.mockResolvedValue(null);
  });
});

// describe('Like a Tweet Function', () => {
//   describe('auth_key in header', () => {
//     describe('auth_key is valid', () => {
//       describe('user Found', () => {
//         describe('tweet exists', () => {
//           describe('like exists', () => {
//             test('should respond with status 400', async () => {
//               const user = {
// unSeenConversation:0,
// notificationCount:0,
//                 id: 'eac0ece1',
//                 name: 'Zahran',
//                 birthDate: new Date(),
//                 location: null,
//                 url: null,
//                 description: null,
//                 protected: false,
//                 verified: false,
//                 followersCount: 0,
//                 followingCount: 0,
//                 createdAt: new Date(),
//                 deletedAt: null,
//                 profileBannerUrl: null,
//                 profileImageUrl: null,
//                 email: 'ahmed@gmail.com',
//                 userName: 'ahmedzahran12364',
//                 password:
//                   '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
//                 passwordChangedAt: null,
//                 passwordResetToken: null,
//                 passwordResetExpires: null,
//                 google_id: null,
//               };
//               const tweet = {
//                 createdAt: new Date(),
//                 id: 'djfk',
//                 text: 'dsgf',
//                 source: 'dsdg',
//                 coordinates: 'dsgds',
//                 author: 'gsd',
//                 userId: 'dsgdsg',
//                 replyToTweetId: null,
//                 replyCount: 0,
//                 retweetedId: null,
//                 retweetCount: 0,
//                 qouteTweetedId: null,
//                 qouteCount: 0,
//                 likesCount: 0,
//                 readCount: 0,
//                 sensitive: false,
//                 deletedAt: new Date(),
//               };
//               const like = {
//                 userId: 'fjdh',
//                 tweetId: 'jdjhfj',
//               };
//               jest.mock('bcrypt');
//               bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
//               jest.mock('jsonwebtoken');
//               jwt.sign = jest.fn().mockResolvedValue('generated_token');
//               jwt.verify = jest.fn().mockResolvedValue({
//                 id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
//                 iat: 1701267900,
//                 exp: 1709043900,
//               });
//               prismaMock.user.findFirst.mockResolvedValueOnce(user);
//               prismaMock.like.findUnique.mockResolvedValueOnce(like);
//               prismaMock.tweet.findUnique.mockResolvedValueOnce(tweet);

//               const response = await Request(app)
//                 .post('/api/v1/tweets/123456/like')
//                 .set('authorization', 'Bearer abc123');
//               expect(response.status).toBe(400);
//               expect(response.body.message).toStrictEqual(
//                 "Tweet is already liked or doesn't exist",
//               );
//             });
//           });
//           describe('like doesnot exists', () => {
//             test('should respond with status 200', async () => {
//               const user = {
// unSeenConversation:0,
// notificationCount:0,
//                 id: 'eac0ece1',
//                 name: 'Zahran',
//                 birthDate: new Date(),
//                 location: null,
//                 url: null,
//                 description: null,
//                 protected: false,
//                 verified: false,
//                 followersCount: 0,
//                 followingCount: 0,
//                 createdAt: new Date(),
//                 deletedAt: null,
//                 profileBannerUrl: null,
//                 profileImageUrl: null,
//                 email: 'ahmed@gmail.com',
//                 userName: 'ahmedzahran12364',
//                 password:
//                   '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
//                 passwordChangedAt: null,
//                 passwordResetToken: null,
//                 passwordResetExpires: null,
//                 google_id: null,
//               };
//               const tweet = {
//                 createdAt: new Date(),
//                 id: 'djfk',
//                 text: 'dsgf',
//                 source: 'dsdg',
//                 coordinates: 'dsgds',
//                 author: 'gsd',
//                 userId: 'dsgdsg',
//                 replyToTweetId: null,
//                 replyCount: 0,
//                 retweetedId: null,
//                 retweetCount: 0,
//                 qouteTweetedId: null,
//                 readCount: 0,
//                 qouteCount: 0,
//                 likesCount: 0,
//                 sensitive: false,
//                 deletedAt: new Date(),
//               };
//               jest.mock('bcrypt');
//               bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
//               jest.mock('jsonwebtoken');
//               jwt.sign = jest.fn().mockResolvedValue('generated_token');
//               jwt.verify = jest.fn().mockResolvedValue({
//                 id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
//                 iat: 1701267900,
//                 exp: 1709043900,
//               });
//               prismaMock.user.findFirst.mockResolvedValueOnce(user);
//               prismaMock.like.findUnique.mockResolvedValueOnce(null);
//               prismaMock.tweet.findUnique.mockResolvedValueOnce(tweet);
//               prismaMock.like.update.mockImplementation();

//               const response = await Request(app)
//                 .post('/api/v1/tweets/123456/like')
//                 .set('authorization', 'Bearer abc123');
//               expect(response.status).toBe(200);
//               expect(response.body.status).toStrictEqual('success');
//             });
//           });
//         });
//         describe('tweet doesnot exists', () => {
//           test('should respond with status 400', async () => {
//             const user = {
// unSeenConversation: 0,
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
//             prismaMock.like.findUnique.mockResolvedValueOnce(null);
//             prismaMock.tweet.findUnique.mockResolvedValueOnce(null);

//             const response = await Request(app)
//               .post('/api/v1/tweets/123456/like')
//               .set('authorization', 'Bearer abc123');
//             expect(response.status).toBe(400);
//             expect(response.body.message).toStrictEqual(
//               "Tweet is already liked or doesn't exist",
//             );
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
//             .post('/api/v1/tweets/123456/like')
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
//           .post('/api/v1/tweets/123456/like')
//           .set('authorization', 'Bearer abc123');

//         expect(response.status).toBe(409);
//         expect(response.body.message).toStrictEqual('Token Expired');
//       });
//       test('should respond with status 409 token invalid', async () => {
//         jwt.verify = jest.fn().mockResolvedValueOnce({});

//         const response = await Request(app)
//           .post('/api/v1/tweets/123456/like')
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
//       const response = await Request(app).post('/api/v1/tweets/123456/like');
//       expect(response.status).toBe(401);
//       expect(response.body.message).toStrictEqual('Unauthorized access');
//     });
//   });
// });

describe('Dislike a Tweet Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        describe('tweet exists', () => {
          describe('like doesnot exist', () => {
            test('should respond with status 400', async () => {
              const user = {
                unSeenConversation: 0,
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
              const tweet = {
                createdAt: new Date(),
                id: 'djfk',
                text: 'dsgf',
                source: 'dsdg',
                coordinates: 'dsgds',
                author: 'gsd',
                userId: 'dsgdsg',
                replyToTweetId: null,
                replyCount: 0,
                retweetedId: null,
                retweetCount: 0,
                qouteTweetedId: null,
                qouteCount: 0,
                likesCount: 0,
                sensitive: false,
                readCount: 0,
                deletedAt: new Date(),
              };
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.like.findUnique.mockResolvedValueOnce(null);
              prismaMock.tweet.findUnique.mockResolvedValueOnce(tweet);

              const response = await Request(app)
                .delete('/api/v1/tweets/123456/like')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(400);
              expect(response.body.message).toStrictEqual(
                "Tweet is not liked or doesn't exist",
              );
            });
          });
          describe('like exists', () => {
            test('should respond with status 200', async () => {
              const user = {
                unSeenConversation: 0,
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
              const tweet = {
                createdAt: new Date(),
                id: 'djfk',
                text: 'dsgf',
                source: 'dsdg',
                coordinates: 'dsgds',
                author: 'gsd',
                userId: 'dsgdsg',
                replyToTweetId: null,
                replyCount: 0,
                retweetedId: null,
                retweetCount: 0,
                qouteTweetedId: null,
                qouteCount: 0,
                likesCount: 0,
                readCount: 0,
                sensitive: false,
                deletedAt: new Date(),
              };
              const like = {
                userId: 'fjdh',
                tweetId: 'jdjhfj',
              };
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.like.findUnique.mockResolvedValueOnce(like);
              prismaMock.tweet.findUnique.mockResolvedValueOnce(tweet);
              prismaMock.like.delete.mockImplementation();

              const response = await Request(app)
                .delete('/api/v1/tweets/123456/like')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(200);
              expect(response.body.status).toStrictEqual('success');
            });
          });
        });
        describe('tweet doesnot exists', () => {
          test('should respond with status 400', async () => {
            const user = {
              unSeenConversation: 0,
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
            jest.mock('bcrypt');
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            jest.mock('jsonwebtoken');
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
              iat: 1701267900,
              exp: 1709043900,
            });
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            prismaMock.like.findUnique.mockResolvedValueOnce(null);
            prismaMock.tweet.findUnique.mockResolvedValueOnce(null);

            const response = await Request(app)
              .delete('/api/v1/tweets/123456/like')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(400);
            expect(response.body.message).toStrictEqual(
              "Tweet is not liked or doesn't exist",
            );
          });
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .delete('/api/v1/tweets/123456/like')
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
          .delete('/api/v1/tweets/123456/like')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .delete('/api/v1/tweets/123456/like')
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
      const response = await Request(app).delete('/api/v1/tweets/123456/like');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('Mute a User Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        describe('user2 exists', () => {
          describe('mute exists', () => {
            test('should respond with status 400', async () => {
              const user = {
                unSeenConversation: 0,
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
              const user2 = {
                unSeenConversation: 0,
                notificationCount: 0,
                id: 'eac0ecfe1',
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
              const mute = {
                muterId: 'fjdh',
                mutedId: 'jdjhfj',
              };
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.user.findUnique.mockResolvedValueOnce(user2);
              prismaMock.mute.findUnique.mockResolvedValueOnce(mute);

              const response = await Request(app)
                .post('/api/v1/user/mute/123456')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(400);
              expect(response.body.message).toStrictEqual(
                'User is already muted',
              );
            });
          });
          describe('muter == muted', () => {
            test('should respond with status 401', async () => {
              const user = {
                unSeenConversation: 0,
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
              const user2 = {
                unSeenConversation: 0,
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
              const mute = {
                muterId: 'fjdh',
                mutedId: 'jdjhfj',
              };
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.user.findUnique.mockResolvedValueOnce(user2);
              prismaMock.mute.findUnique.mockResolvedValueOnce(mute);

              const response = await Request(app)
                .post('/api/v1/user/mute/123456')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(401);
              expect(response.body.message).toStrictEqual(
                "Can't Mute Yourself",
              );
            });
          });
          describe('mute doesnot exist', () => {
            test('should respond with status 200', async () => {
              const user = {
                unSeenConversation: 0,
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
              const user2 = {
                unSeenConversation: 0,
                notificationCount: 0,
                id: 'eac0eceg1',
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
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.user.findUnique.mockResolvedValueOnce(user2);
              prismaMock.mute.findUnique.mockResolvedValueOnce(null);
              prismaMock.mute.create.mockImplementation();

              const response = await Request(app)
                .post('/api/v1/user/mute/123456')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(200);
              expect(response.body.message).toStrictEqual(
                'User muted successfully',
              );
            });
          });
        });
        describe('user2 doesnot exist', () => {
          test('should respond with status 404', async () => {
            const user = {
              unSeenConversation: 0,
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
            jest.mock('bcrypt');
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            jest.mock('jsonwebtoken');
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
              iat: 1701267900,
              exp: 1709043900,
            });
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            prismaMock.user.findUnique.mockResolvedValueOnce(null);

            const response = await Request(app)
              .post('/api/v1/user/mute/123456')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(404);
            expect(response.body.message).toStrictEqual(
              'User to mute not found',
            );
          });
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .post('/api/v1/user/mute/123456')
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
          .post('/api/v1/user/mute/123456')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .post('/api/v1/user/mute/123456')
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
      const response = await Request(app).post('/api/v1/user/mute/123456');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('Unmute a User Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        describe('user2 exists', () => {
          describe('mute exists', () => {
            test('should respond with status 200', async () => {
              const user = {
                unSeenConversation: 0,
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
              const user2 = {
                unSeenConversation: 0,
                notificationCount: 0,
                id: 'eac0ecfe1',
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
              const mute = {
                muterId: 'fjdh',
                mutedId: 'jdjhfj',
              };
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.user.findUnique.mockResolvedValueOnce(user2);
              prismaMock.mute.findUnique.mockResolvedValueOnce(mute);
              prismaMock.mute.delete.mockImplementation();

              const response = await Request(app)
                .delete('/api/v1/user/mute/123456')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(200);
              expect(response.body.message).toStrictEqual(
                'User unmuted successfully',
              );
            });
          });
          describe('unmuter == unmuted', () => {
            test('should respond with status 401', async () => {
              const user = {
                unSeenConversation: 0,
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
              const user2 = {
                unSeenConversation: 0,
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
              const mute = {
                muterId: 'fjdh',
                mutedId: 'jdjhfj',
              };
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.user.findUnique.mockResolvedValueOnce(user2);
              prismaMock.mute.findUnique.mockResolvedValueOnce(mute);

              const response = await Request(app)
                .delete('/api/v1/user/mute/123456')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(401);
              expect(response.body.message).toStrictEqual(
                "Can't Unmute Yourself",
              );
            });
          });
          describe('mute doesnot exist', () => {
            test('should respond with status 400', async () => {
              const user = {
                unSeenConversation: 0,
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
              const user2 = {
                unSeenConversation: 0,
                notificationCount: 0,
                id: 'eac0eceg1',
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
              jest.mock('bcrypt');
              bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
              jest.mock('jsonwebtoken');
              jwt.sign = jest.fn().mockResolvedValue('generated_token');
              jwt.verify = jest.fn().mockResolvedValue({
                id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
                iat: 1701267900,
                exp: 1709043900,
              });
              prismaMock.user.findFirst.mockResolvedValueOnce(user);
              prismaMock.user.findUnique.mockResolvedValueOnce(user2);
              prismaMock.mute.findUnique.mockResolvedValueOnce(null);

              const response = await Request(app)
                .delete('/api/v1/user/mute/123456')
                .set('authorization', 'Bearer abc123');
              expect(response.status).toBe(400);
              expect(response.body.message).toStrictEqual('User is not muted');
            });
          });
        });
        describe('user2 doesnot exist', () => {
          test('should respond with status 404', async () => {
            const user = {
              unSeenConversation: 0,
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
            jest.mock('bcrypt');
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            jest.mock('jsonwebtoken');
            jwt.sign = jest.fn().mockResolvedValue('generated_token');
            jwt.verify = jest.fn().mockResolvedValue({
              id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
              iat: 1701267900,
              exp: 1709043900,
            });
            prismaMock.user.findFirst.mockResolvedValueOnce(user);
            prismaMock.user.findUnique.mockResolvedValueOnce(null);

            const response = await Request(app)
              .delete('/api/v1/user/mute/123456')
              .set('authorization', 'Bearer abc123');
            expect(response.status).toBe(404);
            expect(response.body.message).toStrictEqual(
              'User to unmute not found',
            );
          });
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .delete('/api/v1/user/mute/123456')
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
          .delete('/api/v1/user/mute/123456')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .delete('/api/v1/user/mute/123456')
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
      const response = await Request(app).delete('/api/v1/user/mute/123456');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('get Mute List of a User Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('should respond with status 200', async () => {
          const user = {
            unSeenConversation: 0,
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
          const muteObject = {
            mutedId: 'dsjhf',
            muterId: 'sdjkf',
            muted: [
              {
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
              },
            ],
          };
          const follow = {
            folowererId: 'dfgdfsgsfd',
            followedId: 'dfsgdsfg',
          };
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
            iat: 1701267900,
            exp: 1709043900,
          });
          prismaMock.user.findFirst.mockResolvedValue(user);
          prismaMock.mute.findMany.mockResolvedValue([muteObject]);
          prismaMock.follow.findUnique.mockResolvedValue(follow);

          const response = await Request(app)
            .get('/api/v1/user/mute')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .get('/api/v1/user/mute')
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
          .get('/api/v1/user/mute')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .get('/api/v1/user/mute')
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
      const response = await Request(app).get('/api/v1/user/mute');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

const uploadMiddleware = require('../middlewares/uploadMiddleware');
describe('delete /user/profile_banner', () => {
  jest.mock('../middlewares/uploadMiddleware', () => ({
    deleteImage: jest.fn(),
  }));

  const user = {
    unSeenConversation: 0,
    notificationCount: 0,
    id: 'eac0ece1',
    name: 'ghaith',
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
    email: 'ghaith@gmail.com',
    userName: 'ghaith',
    password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };
  test('should delete a profile picture', async () => {
    jest.spyOn(uploadMiddleware, 'deleteImage').mockReturnValue('');
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    prismaMock.user.findFirst.mockResolvedValue(user);

    prismaMock.user.update.mockResolvedValue(user);
    const response = await Request(app)
      .delete('/api/v1/user/profile_picture')
      .set('authorization', 'Bearer abc123');
    expect(response.body.message).toEqual('Profile picture deleted');
  });
});

describe('delete /user/profile_picture', () => {
  jest.mock('../middlewares/uploadMiddleware', () => ({
    deleteImage: jest.fn(),
  }));

  const user = {
    unSeenConversation: 0,
    notificationCount: 0,
    id: 'eac0ece1',
    name: 'ghaith',
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
    email: 'ghaith@gmail.com',
    userName: 'ghaith',
    password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };
  test('should delete a profile banner', async () => {
    jest.spyOn(uploadMiddleware, 'deleteImage').mockReturnValue('');
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    prismaMock.user.findFirst.mockResolvedValue(user);

    prismaMock.user.update.mockResolvedValue(user);
    const response = await Request(app)
      .delete('/api/v1/user/profile_banner')
      .set('authorization', 'Bearer abc123');
    expect(response.body.message).toEqual('Profile banner deleted');
  });
});

describe('GET /user', () => {
  test('this should send request with header containing token with a non existing user and return 404 with User not found\n', async () => {
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
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);

    const res = await Request(app)
      .get('/api/v1/user/')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
});

describe('delete /user/reset', () => {
  test('this should test reset users endpoint', async () => {
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
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);
    prismaMock.user.updateMany.mockImplementation();
    prismaMock.conversation.updateMany.mockImplementation();

    const res = await Request(app)
      .delete('/api/v1/user/reset')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Done huh');
  });
});

describe('GET /user/search', () => {
  test('this should test search users endpoint', async () => {
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
      unSeenConversation: 0,
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
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);

    const res = await Request(app)
      .get('/api/v1/user/search?q=jhon')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('users');
  });
});

describe('GET /user/followers/:username', () => {
  test('this should test get user followers endpoint', async () => {
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
      unSeenConversation: 0,
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
    const follower = {
      folowererId: 'sdfsfsf',
      followedId: 'sdfsdf',
      follower: {
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
      },
    };

    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);
    prismaMock.follow.findMany.mockResolvedValue([follower]);
    const res = await Request(app)
      .get('/api/v1/user/followers/jhondoe')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
});

describe('GET /user/follow/:username', () => {
  test('this should test get followings user endpoint and get status 200', async () => {
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
      unSeenConversation: 0,
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
    const follower = {
      folowererId: 'sdfsfsf',
      followedId: 'sdfsdf',
      followed: {
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
      },
    };

    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);
    prismaMock.follow.findMany.mockResolvedValue([follower]);
    const res = await Request(app)
      .get('/api/v1/user/follow/jhondoe')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
});

describe('put /user/profile', () => {
  test('thsis  should send request with invalid url', async () => {
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
      unSeenConversation: 0,
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
    const payload = {
      name: ' name',
      description: ' description',
      location: 'location',
      url: 'url',
      birth_date: '2001-03-09T22:18:26.625Z',
    };

    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);
    prismaMock.user.update.mockResolvedValue(user);
    const res = await Request(app)
      .put('/api/v1/user/profile')
      .send(payload)
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual('invalid url');
  });

  test('this  should send request and get 200', async () => {
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
      unSeenConversation: 0,
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
    const payload = {
      name: ' name',
      description: ' description',
      location: 'location',
      url: 'https://url.com',
      birth_date: '2001-03-09T22:18:26.625Z',
    };

    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);
    prismaMock.user.update.mockResolvedValue(user);
    const res = await Request(app)
      .put('/api/v1/user/profile')
      .send(payload)
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });

  test('this  should send request with empty url and get 200', async () => {
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
      unSeenConversation: 0,
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
    const payload = {
      name: ' name',
      description: ' description',
      location: 'location',
      birth_date: '2001-03-09T22:18:26.625Z',
      url: '',
    };

    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user]);
    prismaMock.user.update.mockResolvedValue(user);
    const res = await Request(app)
      .put('/api/v1/user/profile')
      .send(payload)
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
});

describe('get Block List of a User Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        test('should respond with status 200', async () => {
          const blockObject = {
            blockedId: 'dsjhf',
            blockerId: 'sdjkf',
            blocker: [
              {
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
              },
            ],
          };
          const user = {
            unSeenConversation: 0,
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
            blocker: [blockObject],
          };

          const block = {
            blockerId: 'dfgdfsgsfd',
            blockedId: 'dfsgdsfg',
          };
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: '04e10f35-10ed-468b-959e-4a759d7bb6b1',
            iat: 1701267900,
            exp: 1709043900,
          });

          prismaMock.user.findUnique.mockResolvedValue(user);
          prismaMock.user.findFirst.mockResolvedValue(user);
          prismaMock.block.findMany.mockResolvedValue([blockObject]);
          prismaMock.block.findUnique.mockResolvedValue(block);

          const response = await Request(app)
            .get('/api/v1/user/block')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          jest.mock('bcrypt');
          bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
          jest.mock('jsonwebtoken');
          jwt.sign = jest.fn().mockResolvedValue('generated_token');
          jwt.verify = jest.fn().mockResolvedValue({
            id: 'eac0ece1',
            iat: 1699498302,
            exp: 1707274302,
          });
          prismaMock.user.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .get('/api/v1/user/block')
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
          .get('/api/v1/user/block')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .get('/api/v1/user/block')
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
      const response = await Request(app).get('/api/v1/user/block');
      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('GET /user/suggestions', () => {
  test('this should test get user suggestions endpoint and return 200', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });

    const follower = {
      folowererId: 'sdfsfsf',
      followedId: 'sdfsdf',
      followed: {
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
      },
    };
    const user = {
      unSeenConversation: 0,
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
      follower: [follower],
    };

    const follower2 = {
      folowererId: 'aksjvnkdjfnvkjfnvkjdfnv',
      followedId: 'kdfjnvkjdfnv',
      followed: {
        name: 'ghaith',
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
        email: 'ghauth@qwitter.com',
        userName: 'ghaith',
      },
    };

    const user2 = {
      unSeenConversation: 0,
      notificationCount: 0,
      id: '34875938475983475934',
      name: 'jhon doe 2',
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
      email: 'jhon2@qwitter.com',
      userName: 'jhondoe123642222',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: 'registered_fake_token',
      passwordResetExpires: null,
      google_id: '',
      follower: [follower],
    };

    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findMany.mockResolvedValue([user2]);
    prismaMock.follow.findMany.mockResolvedValueOnce([follower, follower2]);

    const res = await Request(app)
      .get('/api/v1/user/suggestions')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
});

describe('POST /user/profile_picture', () => {
  const user = {
    unSeenConversation: 0,
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
    password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };
  test('should send photo and return  status 200', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    prismaMock.user.findFirst.mockResolvedValue(user);

    jest.spyOn(uploadMiddleware, 'uploadImage').mockReturnValue('');

    prismaMock.user.update.mockResolvedValue(user);
    const buffer = Buffer.from('some data');
    const response = await Request(app)
      .post('/api/v1/user/profile_picture')
      .set('authorization', 'Bearer abc123')
      .attach('photo', buffer, 'imageMock/test.jpg');
    expect(response.body.message).toEqual('Image uploaded successfully');
    expect(response.status).toBe(200);
  });
  test('should send empty and return  status 500', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    prismaMock.user.findFirst.mockResolvedValue(user);

    jest.spyOn(uploadMiddleware, 'uploadImage').mockReturnValue('');

    prismaMock.user.update.mockResolvedValue(user);
    const response = await Request(app)
      .post('/api/v1/user/profile_picture')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      'An error occurred while uploading profile picture',
    );
  });
});

describe('POST /user/profile_banner', () => {
  const user = {
    unSeenConversation: 0,
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
    password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };
  test('should send photo and return  status 200', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    prismaMock.user.findFirst.mockResolvedValue(user);

    jest.spyOn(uploadMiddleware, 'uploadImage').mockReturnValue('');

    prismaMock.user.update.mockResolvedValue(user);
    const buffer = Buffer.from('some data');
    const response = await Request(app)
      .post('/api/v1/user/profile_banner')
      .set('authorization', 'Bearer abc123')
      .attach('photo', buffer, 'imageMock/test.jpg');
    expect(response.body.message).toEqual('Image uploaded successfully');
    expect(response.status).toBe(200);
  });
  test('should send empty and return  status 500', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    prismaMock.user.findFirst.mockResolvedValue(user);

    jest.spyOn(uploadMiddleware, 'uploadImage').mockReturnValue('');

    prismaMock.user.update.mockResolvedValue(user);
    const response = await Request(app)
      .post('/api/v1/user/profile_banner')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      'An error occurred while uploading profile picture',
    );
  });
});
