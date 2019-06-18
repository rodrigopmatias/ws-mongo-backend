import express from 'express';

import conf from './conf';
import models from './models';
import controllers from './controllers';
import routes from './routes';

const app = express();

[ conf, models, controllers, routes ].forEach(inject => inject(app));

app.get('/debug', (req, res) => res.status(200).send({ ok: true }));

export default app;