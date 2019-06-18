/* eslint no-console: off */
import app from './app';

const { addr, port } = app.conf.server;

app.listen(
  port,
  addr,
  () => console.log(`Server is ready you can access http://${addr}:${port}/`)
);
