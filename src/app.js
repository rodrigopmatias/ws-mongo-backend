import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import auth from './auth';
import conf from './conf';
import models from './models';
import controllers from './controllers';
import routes from './routes';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

[
  conf,
  models,
  controllers,
  auth,
  routes,
].forEach(inject => inject(app));

export default app;
