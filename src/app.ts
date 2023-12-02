import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { configurePassport } from './utils/passport';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import timelineRouter from './routes/timeline';
import tweetsRouter from './routes/tweets';

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

app.get('/', (_, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">  
  <body>
    <pre>Test 3</pre>
  </body>
  </html>`)
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/timeline', timelineRouter);
app.use('/api/v1/tweets', tweetsRouter);

app.use(globalErrorHandler);

export default app;
