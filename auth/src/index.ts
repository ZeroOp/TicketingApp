import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { singinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { json } from 'body-parser';
import { NotFoundError } from './errors/not-found-error';
const app = express();
app.use(json());

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

app.listen(3000, () => {
  console.log('Auth service listening on port 3000!!!!!!!!!');
});