import jwt from 'jwt-simple';

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
