import express from 'express';
import { json } from 'body-parser';

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@zeroop-dev/common';
import { createTicketRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false  // in a test env we can make this false. 
  })
)

app.use(createTicketRouter)
// any route which is not found we are throughing the same error which is in the customError Format. 
// made all the errors in the same format to make the client understand easily
// if we have the async function then we need to use the next callback function like next(new NotFoundError()) instaead of using the throw new NotFoundError()
app.use(() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};