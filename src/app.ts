import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { configurePassport } from './utils/passport';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import timelineRouter from './routes/timeline';
import tweetsRouter from './routes/tweets';
import conversationRouter from './routes/conversation'

import path from 'path';
import cors from 'cors';
import globalErrorHandler from './controllers/errorController';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/imgs', express.static(path.resolve('./public/imgs/')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/timeline', timelineRouter);
app.use('/api/v1/tweets', tweetsRouter);
app.use('/api/v1/conversation', conversationRouter);

app.use(globalErrorHandler);

export default app;
