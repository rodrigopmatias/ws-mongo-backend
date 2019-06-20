import fs from 'fs';

export default {
  ssl: true,
  sslCert: fs.readFileSync('/run/secrets/cert'),
  sslKey: fs.readFileSync('/run/secrets/pkey'),
  sslPort: 4443,
}