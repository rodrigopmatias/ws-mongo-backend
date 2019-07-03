/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';

export default (app) => {
  app.models = {};

  fs.readdirSync(__dirname)
    .filter(filename => /^.*\.js$/.test(filename))
    .filter(filename => filename !== 'index.js')
    .map(filename => path.join(__dirname, filename))
    .forEach((filepath) => {
      const pkg = require(filepath);
      const model = pkg.default(app);

      Object.defineProperty(app.models, model.modelName, {
        enumerable: true,
        value: model,
        writable: false,
      });
    });

  const { Permission } = app.models;

  console.log('Register models:');
  Object.keys(app.models)
    .forEach((name) => {
      console.log(` » ${name}`);
      ['GET', 'POST', 'PUT', 'DELETE'].forEach(
        codename => Permission.register(name, codename),
      );
    });
};
