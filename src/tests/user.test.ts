import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('GET /user', () => {
  test('this should send request with header containing token and return a user', async () => {
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
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findFirst.mockResolvedValue(user);
    const res = await Request(app)
      .get('/api/v1/user')
      .set('authorization', 'Bearer abc123');
    expect(res.status).toBe(200);
  });
  test('this should send request with header containing token and return unauthorized access', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({});
    prismaMock.user.findFirst.mockResolvedValue(null);
    const res = await Request(app)
      .get('/api/v1/user')
      .set('authorization', 'abc123');
    expect(res.status).toBe(401);
  });
});

describe('userNameSuggestions Function', () => {
  describe('auth_key in header', () => {
    describe('auth_key is valid', () => {
      describe('user Found', () => {
        describe('userName isnot taken', () => {
          test('should respond with status 200', async () => {
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
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
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef'
    });
    prismaMock.block.findFirst.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef'
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const user2 = {
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
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
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef'
    });
    prismaMock.block.findFirst.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef'
    });
    prismaMock.block.delete.mockResolvedValue({
      blockerId: '251f773f-f284-4522-8e55-a17b6ddb63ef',
      blockedId: '251f773e-f284-4522-8e55-a17b6ddb63ef'
    });

    const response = await Request(app)
      .delete('/api/v1/user/block/ahmedibrahim')
      .set('Authorization', 'Bearer 251f773f-f284-4522-8e55-a17b6ddb63ef');

    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toEqual({ status: 'success' });
    
    prismaMock.user.findFirst.mockResolvedValue(null);

  });

});
