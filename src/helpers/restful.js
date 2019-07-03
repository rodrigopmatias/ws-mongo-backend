import express from 'express';
import HttpStatus from 'http-status-codes';
import { middleware } from '../auth';

export default (app, controller) => {
  const base = new express.Router();
  const { modelName } = controller.Model;

  base.route('/')
    .all(middleware.authRequired)
    .all(middleware.permissionRequired(modelName, 'GET'))
    .options(async (req, res) => {
      const allowed = (await req.user.permissionForModel(modelName)).map(perm => perm.codename);

      if (allowed.indexOf('GET') >= 0) {
        allowed.push('HEAD');
      }

      res.status(HttpStatus.OK).send(allowed.join(' '));
    });

  base.route('/')
    .all(middleware.authRequired)
    .all(middleware.permissionRequired(modelName, 'GET'))
    .get(async (req, res) => {
      const ret = await controller.find(
        JSON.parse(req.query.filters || '{}'),
        JSON.parse(req.query.sort || '{}'),
        Number.parseInt(req.query.limit || '30', 10),
        Number.parseInt(req.query.page || '0', 10),
      );

      res.status(ret.status).send(ret.result);
    });

  return base;
};
