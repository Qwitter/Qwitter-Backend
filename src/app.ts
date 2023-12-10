import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { configurePassport } from './utils/passport';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import timelineRouter from './routes/timeline';
import tweetsRouter from './routes/tweets';
import conversationRouter from './routes/conversation';
import trendsRouter from './routes/trends';

import cookieParser from 'cookie-parser';
// import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import cors from 'cors';
import globalErrorHandler from './controllers/errorController';
// import { AppError } from './utils/appError';

const app = express();

// Secuirty Middlewares
// app.use(helmet()); //

const limiter = rateLimit({
  max: 100, // 100 request per minute
  windowMs: 60 * 1000, // One Minute
  message: 'Too many requests dude ! Please try again in 1 minute',
});
app.use('/api', limiter);
app.use(cors());

// Body parsing middlewares
app.use(express.json({ limit: '100kb' })); // Maximum request size

// Static files middlewares
app.use('/imgs', express.static(path.resolve('./public/imgs/')));
app.use(express.urlencoded({ extended: true }));

// oAuth Headers
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

configurePassport();

app.get('/', (_, res) => {
  res.send('Qwitter');
});

// Routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/timeline', timelineRouter);
app.use('/api/v1/tweets', tweetsRouter);
app.use('/api/v1/conversation', conversationRouter);
app.use('/api/v1/trends', trendsRouter);

// Handling Not found

// app.all('*', (req, _res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//   return;
// });

app.use(globalErrorHandler);

export default app;
