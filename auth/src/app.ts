import express from 'express';
import { json } from 'body-parser';

import cookieSession from 'cookie-session'
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { singinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
)

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(singinRouter);

// any route which is not found we are throughing the same error which is in the customError Format. 
// made all the errors in the same format to make the client understand easily
// if we have the async function then we need to use the next callback function like next(new NotFoundError()) instaead of using the throw new NotFoundError()
app.use(() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};