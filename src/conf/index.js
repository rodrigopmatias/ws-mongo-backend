import server from './server';
import mongoose from './mongoose';

let conf = {};

export default app => {
  conf = {
    server,
    mongoose,
  }

  app.conf = conf;
}