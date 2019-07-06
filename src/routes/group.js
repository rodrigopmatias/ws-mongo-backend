import restFactory from '../helpers/restful';

export default (app) => {
  app.use('/groups', restFactory(app, app.controllers.GroupController, ''));
};
