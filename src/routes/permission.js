import restFactory from '../helpers/restful';

export default (app) => {
  app.use('/permissions', restFactory(app, app.controllers.PermissionController, ''));
};
