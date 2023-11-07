import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import {
  createUniqueUserName,
  generateJWTToken,
} from '../controllers/authController';

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
            const newUser = await prisma.user.create({
              data: {
                name: profile.displayName,
                email: profile._json.email as string,
                birthDate: new Date('01-01-2001'),
                userName: (
                  await createUniqueUserName(profile.displayName, 1)
                )[0],
                createdAt: new Date().toISOString(),
                location: '',
                passwordChangedAt: new Date().toISOString(),
                password: 'password_placeholder',
              },
              select: {
                id: true,
                name: true,
                birthDate: true,
                email: true,
                createdAt: true,
                google_id: true,
              },
            });
            const token = generateJWTToken(newUser.id);
            const response = {
              user: newUser,
              token: token,
            };
            return done(null, response);
          }
          const token = generateJWTToken(user.id);
          const response = {
            user: user,
            token: token,
          };

          return done(null, response);
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
