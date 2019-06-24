/* eslint no-console: off */
import http from 'http';
import https from 'https';
import app from './app';

const { addr, port } = app.conf.server;
const {
  tls, tlsCert, tlsKey, tlsPort,
} = app.conf.tls;

http.createServer(app).listen(
  port,
  addr,
  () => console.log(`Server is ready you can access http://${addr}:${port}/`),
);

if (tls) {
  const options = {
    cert: tlsCert,
    key: tlsKey,
  };

  https.createServer(options, app)
    .listen(
      tlsPort,
      addr,
      () => console.log(`Server is ready you can access https://${addr}:${tlsPort}/`),
    );
}
