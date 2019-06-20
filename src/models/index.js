/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import path from 'path';
import fs from 'fs';

export default (app) => {
  app.models = {};
  const { mongoose } = app.conf;

  fs.readdirSync(__dirname)
    .filter(filename => /^.*\.js$/.test(filename))
    .filter(filename => filename !== 'index.js')
    .map(filename => path.join(__dirname, filename))
    .forEach((filepath) => {
      const pkg = require(filepath);
      const model = pkg.default(mongoose);

      Object.defineProperty(app.models, model.modelName, {
        enumerable: true,
        value: model,
        writable: false,
      });
    });
};
