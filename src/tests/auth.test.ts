import * as authController from '../controllers/authController';
import { prismaMock } from '../singleton';
import Request from 'supertest';
import request from 'supertest';
import app from '../app';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendNotification } from '../utils/notifications';

jest.mock('../utils/notifications'); // this happens automatically with automocking
jest.mocked(sendNotification).mockImplementation(() => {
  return {
    method: {},
  };
});
//mocking sendEmail
const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

// In order to return a specific value you can use this instead
// const sendMailMock = jest.fn().mockReturnValue(/* Whatever you would expect as return value */);

jest.mock('nodemailer');

const nodemailer = require('nodemailer'); //doesn't work with import. idk why
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
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

// test isEmail function
describe('isEmail Function', () => {
  describe('given a right email', () => {
    test('should respond with true', () => {
      const result = authController.isEmail('ahmed.zahran02@eng-st.cu.edu.eg');
      expect(result).toBe(true);
    });
  });
  describe('given a false email', () => {
    test('should respond with false', () => {
      const result = authController.isEmail('ahmedzahran2025');
      expect(result).toBe(false);
    });
  });
  describe('given an empty string', () => {
    test('should respond with false', () => {
      const result = authController.isEmail('');
      expect(result).toBe(false);
    });
  });
});

//test checkExistence function
describe('checkExistence Function', () => {
  describe('given an email and is available', () => {
    test('should respond with a status 200', async () => {
      const req = {
        userNameOrEmail: 'ahmed@qwitter2.com',
      };
      prismaMock.user.findFirst.mockResolvedValue(null);
      const response = await Request(app)
        .post('/api/v1/auth/check-existence')
        .send(req);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ available: true });
    });
  });
  describe('given an email and isnot available', () => {
    test('should respond with a status 404', async () => {
      const req = {
        userNameOrEmail: 'ahmed@gmail.com',
      };
      const user = {
        unSeenConversation: 0,
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'Ahmed Zahran',
        google_id: null,
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
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      const response = await Request(app)
        .post('/api/v1/auth/check-existence')
        .send(req);
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({ available: false });
    });
  });
  describe('given an user name and is available', () => {
    test('should respond with a status 200', async () => {
      const req = {
        userNameOrEmail: 'ahmedzahran12364',
      };
      prismaMock.user.findFirst.mockResolvedValue(null);
      const response = await Request(app)
        .post('/api/v1/auth/check-existence')
        .send(req);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ available: true });
    });
  });
  describe('given an user name and isnot available', () => {
    test('should respond with a status 404', async () => {
      const req = {
        userNameOrEmail: 'ahmedzahran12364',
      };
      const user = {
        unSeenConversation: 0,
        notificationCount: 0,
        id: '251f773f-f284-4522-8e55-a17b6ddb63ef',
        name: 'Ahmed Zahran',
        google_id: null,
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
      };
      prismaMock.user.findFirst.mockResolvedValue(user);
      const response = await Request(app)
        .post('/api/v1/auth/check-existence')
        .send(req);
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({ available: false });
    });
  });
});

describe('POST /auth/login', () => {
  test('should send post request to login with a registered user using username and respond with status and token and user', async () => {
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
      email: 'ahmed@gmail.com',
      userName: 'ahmedzahran12364',
      password: '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    // Mocking creating notification
    const tempNotification = {
      id: '1',
      deleted: false,
      seen: false,
      senderId: '1',
      type: 'type',
      createdAt: new Date(),
      objectId: '1',
    };
    const tempReceiveNotification = {
      recieverId: '1',
      notificationId: '1',
    };
    prismaMock.notification.create.mockResolvedValue(tempNotification);
    prismaMock.recieveNotification.create.mockResolvedValue(
      tempReceiveNotification,
    );

    const response = await request(app).post('/api/v1/auth/login').send({
      email_or_username: 'jhondoe',
      password: '123456',
    });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  }),
    test('should send post request to login unregistered user and respond with message indicating the error and status 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const response = await request(app).post('/api/v1/auth/login').send({
        email_or_username: 'unregistered@example.com',
        password: '123456',
      });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('message');
    });
});

// test verifyEmail
describe('verifyEmail Function', () => {
  describe('given an Invalid email', () => {
    test('should respond with a status 400', async () => {
      const req = {
        email: 'ahmedzwitter.com',
      };
      const response = await Request(app)
        .post('/api/v1/auth/verify-email/123456')
        .send(req);
      expect(response.status).toBe(400);
    });
  });
  describe('given a valid email', () => {
    describe('email is already used', () => {
      test('should respond with a status 409', async () => {
        const req = {
          email: 'ahmed@qwitter.com',
        };
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
          password:
            '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
          passwordChangedAt: null,
          passwordResetToken: null,
          passwordResetExpires: null,
          google_id: null,
        };
        prismaMock.user.findFirst.mockResolvedValue(user);
        const response = await Request(app)
          .post('/api/v1/auth/verify-email/123456')
          .send(req);
        expect(response.status).toEqual(409);
        expect(response.body.message).toStrictEqual('User already exists');
      });
    });
    describe('email is not used', () => {
      describe('verification email isnot found', () => {
        test('should respond with a status 409', async () => {
          const req = {
            email: 'ahmed@qwitter.com',
          };
          prismaMock.user.findFirst.mockResolvedValue(null);
          prismaMock.emailVerification.findFirst.mockResolvedValue(null);
          const response = await Request(app)
            .post('/api/v1/auth/verify-email/123456')
            .send(req);
          expect(response.status).toEqual(409);
          expect(response.body.message).toStrictEqual(
            'Please request Verification first',
          );
        });
      });
      describe('verification email is found', () => {
        describe('token is valid', () => {
          test('should respond with a status 200', async () => {
            const req = {
              email: 'ahmed@qwitter.com',
            };
            prismaMock.user.findFirst.mockResolvedValue(null);
            prismaMock.emailVerification.update.mockImplementation(jest.fn());
            prismaMock.emailVerification.findFirst.mockResolvedValue({
              email: 'ahmed@qwitter.com',
              code: crypto.createHash('sha256').update('123456').digest('hex'),
              verified: false,
            });
            const response = await Request(app)
              .post('/api/v1/auth/verify-email/123456')
              .send(req);
            expect(response.status).toEqual(200);
            expect(response.body.message).toStrictEqual(
              'Email Verified Successfully',
            );
          });
        });
        describe('token isnot valid', () => {
          test('should respond with a status 409', async () => {
            const req = {
              email: 'ahmed@qwitter.com',
            };
            prismaMock.user.findFirst.mockResolvedValue(null);
            prismaMock.emailVerification.update.mockImplementation(jest.fn());
            prismaMock.emailVerification.findFirst.mockResolvedValue({
              email: 'ahmed@qwitter.com',
              code: crypto.createHash('sha256').update('123436').digest('hex'),
              verified: false,
            });
            const response = await Request(app)
              .post('/api/v1/auth/verify-email/123456')
              .send(req);
            expect(response.status).toEqual(409);
            expect(response.body.message).toStrictEqual(
              'Wrong Token. Please check again',
            );
          });
        });
      });
    });
  });
});

describe('POST /auth/signup', () => {
  test('should sign up a new user and return a token and user data with status 200', async () => {
    const mockUser = {
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
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.findFirst.mockResolvedValue({
      email: mockUser.email,
      verified: true,
      code: '1234',
    });
    prismaMock.user.create.mockResolvedValue(mockUser);

    const response = await request(app).post('/api/v1/auth/signup').send({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      birthDate: mockUser.birthDate,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('suggestions');
    expect(response.body.data).toHaveProperty('userName');
  });

  test('should not sign up an already registered user and return a 409 error', async () => {
    const mockUser = {
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
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    const response = await request(app).post('/api/v1/auth/signup').send({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      birthDate: mockUser.birthDate,
    });

    expect(response.status).toEqual(409);
  });
  test('unverified email case', async () => {
    const mockUser = {
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
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.findFirst.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockUser);

    const response = await request(app).post('/api/v1/auth/signup').send({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      birthDate: mockUser.birthDate,
    });

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Email is not Verified');
  });
  test('unverified email case', async () => {
    const mockUser = {
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
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.findFirst.mockResolvedValue({
      email: mockUser.email,
      verified: false,
      code: '1234',
    });
    prismaMock.user.create.mockResolvedValue(mockUser);
    prismaMock.emailVerification.delete.mockResolvedValue({
      email: mockUser.email,
      verified: false,
      code: '1234',
    });
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      birthDate: mockUser.birthDate,
    });

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Email is not Verified');
  });
});

describe('POST /send-verification-email', () => {
  test('should update verification code if email exists', async () => {
    const mockRequest = { body: { email: 'existing@example.com' } };
    const existingVerificationCode = {
      email: 'existing@example.com',
      code: '1234',
      verified: false,
    };

    prismaMock.emailVerification.findFirst.mockResolvedValue(
      existingVerificationCode,
    );
    prismaMock.emailVerification.update.mockResolvedValue(
      existingVerificationCode,
    );
    const response = await request(app)
      .post('/api/v1/auth/send-verification-email')
      .send(mockRequest.body);

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(
      'Sent Verification Email Successfully ',
    );
  });

  test('should create verification code if email does not exist', async () => {
    const mockRequest = { body: { email: 'new@example.com' } };
    const existingVerificationCode = {
      email: 'new@example.com',
      code: '1234',
      verified: false,
    };
    prismaMock.emailVerification.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.create.mockResolvedValue(
      existingVerificationCode,
    );

    const response = await request(app)
      .post('/api/v1/auth/send-verification-email')
      .send(mockRequest.body);

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(
      'Sent Verification Email Successfully ',
    );
  });
});

describe('POST /change-password', () => {
  const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

  jest.mock('nodemailer');

  const nodemailer = require('nodemailer'); //doesn't work with import. idk why
  nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

  beforeEach(() => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });

  test('should send a matching passwprd and confirmation password and return a msg confirming a change password and status code 200', async () => {
    const req = {
      password: 'password',
      passwordConfirmation: 'password',
    };
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
      passwordResetExpires: null,
      google_id: '',
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const response = await Request(app)
      .post('/api/v1/auth/change-password')
      .send(req)
      .set('authorization', 'Bearer abc1234');
    expect(response.status).toEqual(200);
    expect(response.body.message).toStrictEqual(
      'Password Changed Successfully',
    );
  });

  test('should send a different password and confirmation password and return a msg error and status code 400', async () => {
    const req = {
      password: 'password',
      passwordConfirmation: 'password2',
    };
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
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.findFirst.mockResolvedValue(user);

    const response = await Request(app)
      .post('/api/v1/auth/change-password')
      .send(req)
      .set('authorization', 'Bearer abc1234');

    expect(response.status).toEqual(400);
    expect(response.body.message).toStrictEqual('The passwords do not match');
  });

  test('should send a request with a user that is not logged in  msg error and status code 400', async () => {
    const req = {
      password: 'password',
      passwordConfirmation: 'password2',
    };

    const response = await Request(app)
      .post('/api/v1/auth/change-password')
      .send(req);

    expect(response.status).toEqual(401);
    expect(response.body.message).toStrictEqual('Unauthorized access');
  });
});

describe('POST forgotPassword', () => {
  test('should send a registered email and return a msg confirming a reset email and status code 200', async () => {
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
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);
    // nodemailermock.mock.create

    const req = {
      email: 'anon@gmail.com',
    };
    const response = await Request(app)
      .post('/api/v1/auth/forgot-password')
      .send(req);
    expect(response.status).toEqual(200);
    expect(response.body.message).toStrictEqual(
      'Password reset email sent successfully',
    );
  });

  test('should send a unregistered email and return msg User not found and status 404 ', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const req = {
      email: 'anon@gmail.com',
    };
    const response = await Request(app)
      .post('/api/v1/auth/forgot-password')
      .send(req);
    expect(response.status).toEqual(404);
    expect(response.body.message).toStrictEqual('User not found');
  });
});

describe('POST /reset-password', () => {
  test('should send a registered token and return a msg confirming a reset password and status code 200', async () => {
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
      passwordResetExpires: null,
      google_id: '',
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const req = {
      email: 'anon@gmail.com',
    };
    const response = await Request(app)
      .post('/api/v1/auth/reset-password/token')
      .send(req);
    expect(response.status).toEqual(200);
    expect(response.body.message).toStrictEqual(
      'Password reset was successful',
    );
  });

  test('should send a unregistered token and return msg Invalid token and status 400 ', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const response = await Request(app)
      .post('/api/v1/auth/reset-password/token')
      .send({ email: 'anon@gmail.com' });
    expect(response.status).toEqual(400);
    expect(response.body.message).toStrictEqual('Invalid Token');
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
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const response = await Request(app)
      .post('/api/v1/auth/reset-password/token')
      .send({ email: 'anon@gmail.com' });
    expect(response.status).toEqual(400);
    expect(response.body.message).toStrictEqual(
      'Token expired. Request another token.',
    );
  });
});

// test userNameSuggestions
describe('userNameSuggestions Function', () => {
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
          prismaMock.user.findFirst.mockResolvedValueOnce(user);
          prismaMock.user.findFirst.mockResolvedValueOnce(user);
          prismaMock.user.findFirst.mockResolvedValueOnce(null);

          const response = await Request(app)
            .post('/api/v1/auth/username-suggestions')
            .set('authorization', 'Bearer abc123');
          expect(response.status).toBe(200);
          expect(response.body.suggestions).toHaveLength(5);
        });
      });
      describe('user not Found', () => {
        test('should respond with status 404', async () => {
          prismaMock.user.findFirst.mockResolvedValue(null);

          const response = await Request(app)
            .post('/api/v1/auth/username-suggestions')
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
          .post('/api/v1/auth/username-suggestions')
          .set('authorization', 'Bearer abc123');

        expect(response.status).toBe(409);
        expect(response.body.message).toStrictEqual('Token Expired');
      });
      test('should respond with status 409 token invalid', async () => {
        jwt.verify = jest.fn().mockResolvedValueOnce({});

        const response = await Request(app)
          .post('/api/v1/auth/username-suggestions')
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
        '/api/v1/auth/username-suggestions',
      );

      expect(response.status).toBe(401);
      expect(response.body.message).toStrictEqual('Unauthorized access');
    });
  });
});

describe('POST /auth/update-password', () => {
  test('should update password', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const mockUser = {
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
      password: 'hashed_password',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.findFirst.mockResolvedValue({
      email: mockUser.email,
      verified: true,
      code: '1234',
    });
    prismaMock.user.create.mockResolvedValue(mockUser);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    prismaMock.user.update.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/update-password')
      .send({
        oldPassword: 'hashed_password',
        newPassword: 'dfjkvnfdv',
      })
      .set('authorization', 'Bearer abc123');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password changed successfully');
  });
  test('should send wrong old password and return 401 and message', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });
    const mockUser = {
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
      password: 'hashed_password',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id: null,
    };

    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.findFirst.mockResolvedValue({
      email: mockUser.email,
      verified: true,
      code: '1234',
    });
    prismaMock.user.create.mockResolvedValue(mockUser);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    prismaMock.user.update.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/update-password')
      .send({
        oldPassword: 'wrong_password',
        newPassword: 'dfjkvnfdv',
      })
      .set('authorization', 'Bearer abc123');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect old password');
  });
});

describe('POST /auth/google/signup', () => {
  const mockUser = {
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
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };

  test('should send request without header and return error', async () => {
    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/google/signup')
      .send({
        birthDate: mockUser.birthDate,
      });
    expect(response.status).toEqual(401);
  });
  test('should send request with an already used user and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
      google_id: '32423894',
      email: 'ghaith@gmail.com',
      name: 'ghaith',
    });

    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/google/signup')
      .set('authorization', 'Bearer abc123')
      .send({
        birthDate: mockUser.birthDate,
      });
    expect(response.status).toEqual(409);
    expect(response.body.message).toEqual('User already exists');
  });
  test('should send request and return 200', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
      google_id: '32423894',
      email: 'ghaith@gmail.com',
      name: 'ghaith',
    });

    // prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);
    prismaMock.user.create.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/google/signup')
      .set('authorization', 'Bearer abc123')
      .send({
        birthDate: mockUser.birthDate,
      });
    expect(response.status).toEqual(200);
  });
  test('should send request with invalid access credential and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });

    // prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);
    prismaMock.user.create.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/google/signup')
      .set('authorization', 'Bearer abc123')
      .send({
        birthDate: mockUser.birthDate,
      });
    expect(response.status).toEqual(409);
  });
});

describe('POST /auth/google/login', () => {
  const mockUser = {
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
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };

  const notification = require('../utils/notifications');
  test('should send request with header and return 200', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
      email: 'ga@gmail.com',
    });

    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    prismaMock.notification.create.mockResolvedValue({
      id: '23423',
      objectId: '213412',
      deleted: false,
      seen: false,
      createdAt: new Date(),
      senderId: 'dfd',
      type: 'login',
    });

    prismaMock.recieveNotification.create.mockResolvedValue({
      recieverId: '12312432',
      notificationId: '34562345645',
    });
    jest.spyOn(notification, 'sendNotification').mockReturnValue(null);

    const response = await request(app)
      .post('/api/v1/auth/google/login')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toEqual(200);
  });
  test('should send request without header and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
      email: 'ga@gmail.com',
    });

    jest.spyOn(notification, 'sendNotification').mockReturnValue(null);

    const response = await request(app).post('/api/v1/auth/google/login');
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized access');
  });
  test('should send request with header but without email and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 3458347539845,
    });

    jest.spyOn(notification, 'sendNotification').mockReturnValue(null);

    const response = await request(app)
      .post('/api/v1/auth/google/login')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toEqual(409);
    expect(response.body.message).toEqual('Invalid access credentials');
  });

  test('should send request with header but with expired token and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 0,
      email: 'ga@gmail.com',
    });

    const response = await request(app)
      .post('/api/v1/auth/google/login')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toEqual(409);
    expect(response.body.message).toEqual('Token Expired');
  });
  test('should send request with header deleted user and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 345734765734865,
      email: 'ga@gmail.com',
    });

    const response = await request(app)
      .post('/api/v1/auth/google/login')
      .set('authorization', 'Bearer abc123');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('User not found');
  });
});

describe('POST /auth/check-password', () => {
  const mockUser = {
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
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };

  test('should send request without header and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });

    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/check-password')
      .set('authorization', 'Bearer abc123')
      .send({
        password: 'sdkhfcjshdbc',
      });
    expect(response.status).toEqual(200);
  });
});

describe('POST /auth/change-email', () => {
  const mockUser = {
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
    passwordResetToken: null,
    passwordResetExpires: null,
    google_id: null,
  };

  test('should send request with an unverfied email and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });

    prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);
    prismaMock.emailVerification.findFirst.mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/v1/auth/change-email')
      .set('authorization', 'Bearer abc123')
      .send({
        email: 'ghaith@qwitter.com',
      });
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('email not verified');
  });

  test('should send request with an already email and return error', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });

    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    prismaMock.emailVerification.findFirst.mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/v1/auth/change-email')
      .set('authorization', 'Bearer abc123')
      .send({
        email: 'ghaith@qwitter.com',
      });
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('email is already used');
  });

  test('should send request with an email and return 200', async () => {
    jest.mock('bcrypt');
    bcrypt.hash = jest.fn().mockResolvedValue('right_password');
    jest.mock('jsonwebtoken');
    jwt.sign = jest.fn().mockResolvedValue('generated_token');
    jwt.verify = jest.fn().mockResolvedValue({
      id: 'eac0ece1',
      iat: 1699498302,
      exp: 1707274302,
    });

    prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);
    prismaMock.emailVerification.findFirst.mockResolvedValueOnce({
      email: 'ghaith@gmail.com',
      code: '23214',
      verified: true,
    });
    prismaMock.emailVerification.delete.mockResolvedValue({
      email: 'ghaith@gmail.com',
      code: '23214',
      verified: true,
    });
    prismaMock.user.update.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/auth/change-email')
      .set('authorization', 'Bearer abc123')
      .send({
        email: 'ghaith@qwitter.com',
      });
    expect(response.status).toEqual(200);
  });
});
