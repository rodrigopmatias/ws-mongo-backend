import { OK, UNAUTHORIZED } from 'http-status-codes';

export default (app) => {
  const { AuthController } = app.controllers;

  app.route('/auth/status')
    .get((req, res) => {
      if (req.user) {
        res.status(OK).send({
          ok: true,
          user: req.user,
        });
      } else {
        res.sendStatus(UNAUTHORIZED);
      }
    });

  app.route('/auth/authenticate')
    .post(async (req, res) => {
      const { email, password } = req.body;
      const obj = await AuthController.authenticate(email, password);
      res.status(obj.status).send(obj.result);
    });

  app.route('/auth/activate')
    .get(async (req, res) => {
      const { token } = req.query;
      const obj = await AuthController.activate(token);
      res.status(obj.status).send(obj.result);
    });

  app.route('/auth/request-activation')
    .post(async (req, res) => {
      const { email } = req.body;
      const obj = await AuthController.requestActivation(email);

      res.status(obj.status).send(obj.result);
    });

  app.route('/auth/register')
    .post(async (req, res) => {
      const {
        email, firstName, lastName, password, confirmPassword,
      } = req.body;
      const obj = await AuthController.register({
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
      });

      res.status(obj.status).send(obj.result);
    });
};
