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
      let tweet1={
      createdAt: new Date("2022-03-25")   ,
      id: "123",
      text: "dsvsadv",
      author:user,
      source: "123442",
      coordinates: "12341234",
      replyToTweetId: null,
      replyCount: 0,
      retweetedId: null,
      retweetCount: 0,
      qouteTweetedId: null,
      qouteCount: 0,
      likesCount: 4,
      sensitive: false,
      userId:"251f773f-f284-4522-8e55-a17b6ddb63ef",
      deletedAt:null,
      entities:{
        hashtags:  [],
        media:  [],
        mentions:  [],
        urls:  [],      }
      }
      const tweets=[tweet1]



      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.findFirst.mockResolvedValue(user);

      prismaMock.tweet.findMany.mockResolvedValue(tweets);
      prismaMock.tweetEntity.findUnique.mockResolvedValue({
        tweetId:"123",
        entityId:"234234"
      })
      prismaMock.tweetEntity.findMany.mockResolvedValue([{
        tweetId:"123",
        entityId:"234234"
      }])
      const entity={
        id:"234234",
        type:"media"
      }
      prismaMock.entity.findUnique.mockResolvedValue(entity)

      
  
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
        const user =null
        let tweet1={
        createdAt: new Date("2022-03-25")   ,
        id: "123",
        text: "dsvsadv",
        author:user,
        source: "123442",
        coordinates: "12341234",
        replyToTweetId: null,
        replyCount: 0,
        retweetedId: null,
        retweetCount: 0,
        qouteTweetedId: null,
        qouteCount: 0,
        likesCount: 4,
        sensitive: false,
        userId:"251f773f-f284-4522-8e55-a17b6ddb63ef",
        deletedAt:null,
        entities:{
          hashtags:  [],
          media:  [],
          mentions:  [],
          urls:  [],      }
        }
        const tweets=[tweet1]
  
  
  
        prismaMock.user.findUnique.mockResolvedValue(user);
        prismaMock.user.findFirst.mockResolvedValue(user);
  
        prismaMock.tweet.findMany.mockResolvedValue(tweets);
        prismaMock.tweetEntity.findUnique.mockResolvedValue({
          tweetId:"123",
          entityId:"234234"
        })
        prismaMock.tweetEntity.findMany.mockResolvedValue([{
          tweetId:"123",
          entityId:"234234"
        }])
        const entity={
          id:"234234",
          type:"media"
        }
        prismaMock.entity.findUnique.mockResolvedValue(entity)
  
        
    
        const res = await Request(app)
          .get('/api/v1/tweets/user/123456/media')
          .set('authorization', 'Bearer abc123');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found")
      });
  
  });