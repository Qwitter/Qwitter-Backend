import { prismaMock } from '../singleton';
import Request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';






describe("GET /user",()=>{
    test("this should send request with header containing token and return a user",async ()=>{
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
            password:
              '$2b$12$k8Y1THPD8MUJYkyFmdzAvOGhld7d0ZshTGk.b8kJIoaoGEIR47VMu',
            passwordChangedAt: null,
            passwordResetToken: "registered_fake_token",
            passwordResetExpires: null,
            google_id:""
          };
        prismaMock.user.findFirst.mockResolvedValue(user)
        const res= await Request(app).get('/api/v1/user')
        .set('authorization', 'Bearer abc123');;
        expect(res.status).toBe(200)
});
    test("this should send request with header containing token and return unauthorized access",async ()=>{
        jest.mock('bcrypt');
        bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
        jest.mock('jsonwebtoken');
        jwt.sign = jest.fn().mockResolvedValue('generated_token');
        jwt.verify = jest.fn().mockResolvedValue({
        });
        prismaMock.user.findFirst.mockResolvedValue(null)
        const res= await Request(app).get('/api/v1/user')
        .set('authorization', 'abc123');;
        expect(res.status).toBe(401)
    });
})
