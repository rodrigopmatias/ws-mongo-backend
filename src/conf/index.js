import server from './server';
import ssl from './ssl';
import mongoose from './mongoose';

export default app => {
  app.conf = {
    ssl,
    server,
    mongoose,
  };
}