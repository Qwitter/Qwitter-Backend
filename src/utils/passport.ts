import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: '',
      clientSecret: '',
    },
    () => {},
  ),
);
