/* eslint-disable no-param-reassign */
import server from './server';
import tls from './tls';
import mongoose from './mongoose';
import security from './security';

export default (app) => {
  app.conf = {
    tls,
    server,
    mongoose,
    security,
  };
};
