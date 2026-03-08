import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { singinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { json } from 'body-parser';
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(singinRouter);
app.use(errorHandler);


app.get('/', (req, res) => {
  res.send({ message: 'Auth ser-vice running 🚀' });
});

app.listen(3000, () => {
  console.log('Auth service listening on port 3000!!!!!!!!!');
});