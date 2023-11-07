import * as authController from '../controllers/authController';
import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';

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

// test checkExistence function
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
