/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import path from 'path';
import fs from 'fs';

export default (app) => {
  fs.readdirSync(__dirname)
    .filter(filename => /^.*\.js$/.test(filename))
    .filter(filename => filename !== 'index.js')
    .map(filename => path.join(__dirname, filename))
    .forEach(filepath => require(filepath).default(app));
};
