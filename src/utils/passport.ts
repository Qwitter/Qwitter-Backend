// import passport from 'passport';
// import passportGoogle from 'passport-google-oauth20';
// import passportJWT, { ExtractJwt } from 'passport-jwt';
// import {PrismaClient} from '@prisma/client'
// const GoogleStrategy = passportGoogle.Strategy;
// const JWTStrategy=passportJWT.Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: '/auth/google/redirect',
//       clientID: '',
//       clientSecret: '',
//     },
//     () => {},
//   ),
// );


// const JWTOptions = {
//   secretOrKey:'',
//   jwtFromRequest:ExtractJwt.fromAuthHeader(),

// }

// passport.use(
//   new JWTStrategy(
//     {
//       secretOrKey:'sectret',
//       jwtFromRequest:ExtractJwt.fromAuthHeader(),
//     },
//     function(jwt_payload, done) {
      
//     }
//   )
// )


