import * as authController from '../controllers/authController';
import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//mocking jwt and hashing
jest.mock('bcrypt');
bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
jest.mock('jsonwebtoken');
jwt.sign = jest.fn().mockResolvedValue('generated_token');

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
    const response = await Request(app).post('/api/v1/auth/login').send({
      email_or_username: 'jhondoe',
      password: '123456',
    });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  }),
    test('should send post request to login unregistered user and respond with message indicating the error and status 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const response = await Request(app).post('/api/v1/auth/login').send({
        email_or_username: 'unregistered@example.com',
        password: '123456',
      });

      console.log(response.body, response.status);
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




describe("POST forgotPassword",()=>{
  test("should send a registered email and return a msg confirming a reset email and status code 200",async ()=>{
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      google_id:""
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const req={
      email:"registered email"
    }
    const response = await Request(app)
              .post('/api/v1/auth/forgot-password')
              .send(req);
            expect(response.status).toEqual(200);
            expect(response.body.message).toStrictEqual(
              'Password reset email sent successfully',)
    
            
  })

  test("should send a unregistered email and return msg User not found and status 404 ",async ()=>{
    
    prismaMock.user.findUnique.mockResolvedValue(null);
    const req={
      email:"unregistered email"
    }
    const response = await Request(app)
              .post('/api/v1/auth/forgot-password')
              .send(req);
            expect(response.status).toEqual(404);
            expect(response.body.message).toStrictEqual(
              'User not found',)        
  })
})



describe("POST /reset-password",()=>{
  test("should send a registered token and return a msg confirming a reset password and status code 200",async ()=>{
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
      password:
        '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
      passwordChangedAt: null,
      passwordResetToken: "registered_fake_token",
      passwordResetExpires: null,
      google_id:""
    };
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue(user);

    const req={
      email:"registered email"
    }
    const response = await Request(app)
              .post('/api/v1/auth/forgot-password/registered_fake_token')
              .send(req);
            expect(response.status).toEqual(200);
            expect(response.body.message).toStrictEqual(
              'Password reset email sent successfully',)
    
            
  })

  test("should send a unregistered token and return msg Invalid token and status 400 ",async ()=>{
    
    prismaMock.user.findUnique.mockResolvedValue(null);
    const response = await Request(app)
              .post('/api/v1/auth/forgot-password/unregistered_fake_token')
              .send();
            expect(response.status).toEqual(400);
            expect(response.body.message).toStrictEqual(
              'Invalid Token',)        
  })
})




describe("POST /change-password",()=>{
  test("should send a matching passwprd and confirmation password and return a msg confirming a change password and status code 200",async ()=>{
   

    const req={
      password:"password",
      passwordConfirmation:"password",
      
    }
    const response = await Request(app)
              .post('/api/v1/auth/change-password')
              .send(req);
            expect(response.status).toEqual(200);
            expect(response.body.message).toStrictEqual(
              'Password Changed Successfully',)
    
            
  })

  test("should send a different password and confirmation password and return a msg error and status code 400",async ()=>{
   

    const req={
      password:"password",
      passwordConfirmation:"password2",
      
    }
    const response = await Request(app)
              .post('/api/v1/auth/change-password')
              .send(req);
            expect(response.status).toEqual(400);
            expect(response.body.message).toStrictEqual(
              'The passwords do not match',)
    
            
  })

})
