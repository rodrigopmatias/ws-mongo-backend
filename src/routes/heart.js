import { OK } from 'http-status-codes';

export default (app) => {
  app.get('/ping', (_req, res) => res.status(OK).send(''));
};
