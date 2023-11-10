import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import {
  generateJWTToken,
} from '../controllers/authController';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
        scope: ['profile', 'email'],
      },
      async (_, __, profile: Profile, done) => {
        try {
          const user = await prisma.user.findFirst({
            where: { email: profile._json.email as string },
          });
          if (!user) {
            return done(null, {
              user: {
                ...profile,
                registered: false
              },
              token: sign({ google_id: profile.id, email: profile._json.email }, process.env.JWT_SECRET as string, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              })
            });
          } else {
            const token = generateJWTToken(user.id);
            const response = {
              user: user,
              token: token,
            };
  
            return done(null, response);              
          }
        } catch (error) {
          return done(error, undefined);
        }
      },
    ),
  );

  passport.serializeUser((data: any, done) => {
    done(null, data.user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
