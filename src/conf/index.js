/* eslint-disable no-param-reassign */
import server from './server';
import tls from './tls';
import mongoose from './mongoose';

export default (app) => {
  app.conf = {
    tls,
    server,
    mongoose,
  };
};
