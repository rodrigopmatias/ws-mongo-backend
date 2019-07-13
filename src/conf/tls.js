import fs from 'fs';

const conf = { tls: false };

if ((process.env.APP_TLS || '0') === '1') {
  conf.tls = true;
  conf.tlsCert = fs.readFileSync(process.env.APP_TLS_CERT || '/run/secrets/cert');
  conf.tlsKey = fs.readFileSync(process.env.APP_TLS_KEY || '/run/secrets/pkey');
  conf.tlsPort = Number.parseInt(process.env.APP_TLS_PORT || 8443, 10);
}

export default conf;
