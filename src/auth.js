import jwt from 'jwt-simple';
import { UNAUTHORIZED } from 'http-status-codes';

export default (app) => {
  const { secret } = app.conf.security;
  const { User } = app.models;

  app.use(async (req, _res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'JWT') {
        try {
          const data = jwt.decode(token, secret);
          if (data) {
            const user = await User.findOne({ _id: data.userId });

            if (user && user.isActive) {
              req.user = user;
            }
          }
        } catch (e) {
          req.user = undefined;
        }
      }
    }

    next();
  });
};

export const authRequired = (req, res, next) => {
  if (!req.user) {
    res.status(UNAUTHORIZED).send({
      ok: false,
      message: 'authorization is required for access this action',
    });
  } else {
    next();
  }
};

export const permissionRequired = (permission) => {
  const [name, codename] = permission.split('.');

  return async (req, res, next) => {
    if (!req.user) {
      res.status(UNAUTHORIZED).send({
        ok: false,
        message: 'access dained for this resouce',
      });
    } else {
      const allowed = await req.user.hasPermission(name, codename);

      if (!allowed) {
        res.status(UNAUTHORIZED).send({
          ok: false,
          message: `user ${req.user.email} hasn't permission for this resource.`,
        });
      } else {
        next();
      }
    }
  };
};

export const middleware = {
  authRequired,
  permissionRequired,
};
