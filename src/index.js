/* eslint no-console: off */
import http from 'http';
import https from 'https';
import app from './app';

const { addr, port } = app.conf.server;
const {
  ssl, sslCert, sslKey, sslPort,
} = app.conf.ssl;

http.createServer(app).listen(
  port,
  addr,
  () => console.log(`Server is ready you can access http://${addr}:${port}/`),
);

if (ssl) {
  const options = {
    cert: sslCert,
    key: sslKey,
  };

  https.createServer(options, app)
    .listen(
      sslPort,
      addr,
      () => console.log(`Server is ready you can access https://${addr}:${sslPort}/`),
    );
}
