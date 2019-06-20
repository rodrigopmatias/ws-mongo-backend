import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';


import conf from './conf';
import models from './models';
import controllers from './controllers';
import routes from './routes';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

[conf, models, controllers, routes].forEach(inject => inject(app));

app.get('/debug', (req, res) => res.status(200).send({ ok: true }));

export default app;
