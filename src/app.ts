import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { configurePassport } from './utils/passport';
import authRouter from './routes/auth';
import globalErrorHandler from './controllers/errorController';

const app = express();

app.use(express.json());

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

app.use(globalErrorHandler);

export default app;
